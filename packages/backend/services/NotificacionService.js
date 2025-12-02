import { NotificacionOutputDTO } from "../models/entities/dtos/output/NotificacionOutputDTO.js";
import { Notificacion } from "../models/entities/Notificacion.js";
import { NotificacionNotFoundError, NotificacionUsuarioMissmatchError } from "../errors/NotificacionesErrors.js";
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";

export class NotificacionService {
    constructor(notificacionesRepository, usuariosRepository, factoryNotificacion, productosRepository){
        this.notificacionesRepository = notificacionesRepository
        this.usuariosRepository = usuariosRepository
        this.factoryNotificacion = factoryNotificacion
        this.productosRepository = productosRepository
    }

    async obtenerNotificaciones(idUsuario, leidas, pagina, limite){
        const usuario = await this.usuariosRepository.findById(idUsuario)
        
        if(!usuario){
            throw new UsuarioNotExists()
        }

        const numeroPagina = Math.max(Number(pagina), 1);
        const elementosPagina = Math.min(Math.max(Number(limite), 1), 30);

        const notificaciones = await this.notificacionesRepository.findByPagina(idUsuario, leidas, numeroPagina, elementosPagina)

        const totalNotificaciones = await this.notificacionesRepository.contarNotificacionesDeUnUsuario(idUsuario, leidas);
        const totalPaginas = Math.ceil(totalNotificaciones / elementosPagina)

        return new NotificacionOutputDTO(numeroPagina, elementosPagina, totalNotificaciones, totalPaginas, notificaciones)
        //return notificaciones.map(n => new NotificacionOutputDTO(n))
    }

    
    async marcarNotificacionLeida(idNotificacion, idUsuario){
        const usuario = await this.usuariosRepository.findById(idUsuario)

        if(!usuario){
            throw new UsuarioNotExists()
        }

        const notificacion = await this.notificacionesRepository.findByIdAndLeida(idNotificacion, false);
        if(!notificacion){
            throw new NotificacionNotFoundError("Notificacion no encontrada")
        }

        if(notificacion.usuarioDestino != idUsuario){
            throw new NotificacionUsuarioMissmatchError("El usuario no corresponde a la notificacion")
        }

        notificacion.marcarComoLeida()
        const notificacionLeida = await this.notificacionesRepository.update(notificacion);

        return new NotificacionOutputDTO(notificacionLeida)
    }

    async contarNotificacionesNoLeidas(idUsuario){
        const cantidadNoLeidas = await this.notificacionesRepository.contarNotificacionesDeUnUsuario(idUsuario, false);
        
        return cantidadNoLeidas
    }

    async crearNotificacionItemPedido(itemPedido, usuario){
        let userNotif

        const item = {cantidad: itemPedido.cantidad, producto: itemPedido.producto}

        const pedidoNoti = {
            ...itemPedido.idPedido.toObject(),
            estado: itemPedido.estado,
            items: [item]
        };
        
        if(usuario.tipo == "COMPRADOR"){
            userNotif = {destino: itemPedido.vendedorId, comprador: usuario.nombre, tipo: "VENDEDOR"}
            
        } else {
            userNotif = {destino: pedidoNoti.comprador, vendedor: usuario.nombre, tipo: "COMPRADOR"}
        }

        const notificacion = this.factoryNotificacion.crearSegunPedido(pedidoNoti, userNotif)
        await this.notificacionesRepository.save(notificacion)
    }


    async crearNotificacionPedido(pedido, usuario){

        if(pedido.estado == EstadoPedido.PENDIENTE){
            const usuarioDestino = {destino: pedido.comprador, tipo: usuario.tipo}
            const notificacionComprador = this.factoryNotificacion.crearSegunPedido(pedido, usuarioDestino)

            await this.notificacionesRepository.save(notificacionComprador)
        }
        
        if(usuario.tipo == "COMPRADOR"){
            const itemsPorVendedor = this.obtenerItemsPorVendedor(pedido);

            for (const vendedorId in itemsPorVendedor) {
                const itemsVendedor = itemsPorVendedor[vendedorId]
                const pedidoVendedor = {
                    ...pedido.toObject(),
                    items: itemsVendedor
                }

                const userNotif = {destino: vendedorId, comprador: pedido.comprador.nombre, tipo: usuario.tipo}
                const notificacion = this.factoryNotificacion.crearSegunPedido(pedidoVendedor, userNotif)

                await this.notificacionesRepository.save(notificacion)
            }

        } else {
            const itemsVendedor = this.obtenerItemsPorVendedor(pedido, usuario.id)
            const pedidoVendedor = {
                ...pedido.toObject(),
                items: itemsVendedor
            }
            const userNotif = {destino: pedido.comprador, vendedor: usuario.nombre, tipo: usuario.tipo}
 
            const notificacion = this.factoryNotificacion.crearSegunPedido(pedidoVendedor, userNotif)
            await this.notificacionesRepository.save(notificacion)
        }
    }

    obtenerItemsPorVendedor(pedido, vendedor) {
        const itemsPorVendedor = {};
        pedido.items.forEach(item => {
            const vendedorId = item.vendedorId._id.toString();

            if (!itemsPorVendedor[vendedorId]) {
                itemsPorVendedor[vendedorId] = [];
            }

            itemsPorVendedor[vendedorId].push(item);
        });
        
        if(vendedor){
            return itemsPorVendedor[vendedor]
        } else {
            return itemsPorVendedor
        }
    }

}