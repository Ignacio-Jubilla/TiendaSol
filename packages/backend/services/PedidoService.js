import { PedidoNotFound } from "../errors/PedidosErrors.js";
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";
import { Pedido } from "../models/entities/Pedido.js";
import { PedidoOutputDTO } from "../models/entities/dtos/output/PedidoOutputDTO.js";
import { CancelationError, EntidadNotFoundError } from "../errors/PedidosErrors.js";
import mongoose from "mongoose";
import { es } from "zod/v4/locales";
export class PedidoService {
    constructor(PedidoRepository,UsuariosRepository,ProductosRepository) {
        this.pedidoRepository = PedidoRepository,
        this.usuariosRepository=UsuariosRepository,
        this.productosRepository=ProductosRepository;
    }
    async obtenerPedidosPaginados(page, limit, filtros) {
        const numeroPagina = Math.max(Number(page),1);
        const elemPorPagina = Math.min(Math.max(Number(limit),1),100)// entre 1 y 100

        const pedidosPaginados = await this.pedidoRepository.findByPage(
            numeroPagina, elemPorPagina, filtros
        );
        if (!pedidosPaginados || pedidosPaginados.length === 0) {
            throw new PedidoNotFound('No se encontraron pedidos');
        }
        const total = await this.pedidoRepository.contarTodos(filtros);
        const totalPaginas = Math.ceil(total/elemPorPagina);

        return {
            pagina: numeroPagina,
            PorPagina: elemPorPagina,
            total: total,
            totalPaginas: totalPaginas,
            data: pedidosPaginados
        }

    }
    
    async crearPedido(pedidoInputDTO) {
        const usuario = await this.usuariosRepository.findById(pedidoInputDTO.compradorId);
        if (!usuario) {
            throw new UsuarioNotExists('El usuario comprador no existe');
        }
        for (const item of pedidoInputDTO.items) {
            const producto = await this.productosRepository.findById(item.productoId);
            if (!producto) {
                throw new EntidadNotFoundError("producto con id " + item.productoId + " no encontrado");
            }
            producto.estaDisponible(item.cantidad);
        }
        const nuevoPedido = new Pedido(usuario, pedidoInputDTO.items, 
            pedidoInputDTO.moneda, pedidoInputDTO.direccionEntrega);
        nuevoPedido.agregarEstadoInicial(usuario);

        //ahora tendria que mapear el pedido para guardarlo
        const pedidoData = this.creacionToDB(nuevoPedido); 
        
        // TODO: descontar el stock de los productos del pedido

        await this.pedidoRepository.save(pedidoData);
        return this.toOutputDTO(nuevoPedido);
    }

    // tema a consultar, 
    // si conviene instanciar el pedido para poder usar sus metodos, 
    // o agregar los metodos al documento mongoose
    async cancelarPedido(pedidoId, motivo) {
        const lista = [EstadoPedido.CANCELADO, EstadoPedido.ENTREGADO, EstadoPedido.ENVIADO];
        const pedidoBase = await this.pedidoRepository.findById(pedidoId);
        if (!pedidoBase) {
            throw new PedidoNotFound();
        }
        
        const pedido = Pedido.fromDB(pedidoBase);

        if (lista.includes(pedido.estado)) {
            throw new CancelationError();
        }

        console.log("pedido.comprador:", pedido.comprador);
        
        const compradorId = pedido.comprador.toString();
        const usuarioQueCancela = await this.usuariosRepository.findById(compradorId);
        // falta notif TODO

        pedido.actualizarEstado(EstadoPedido.CANCELADO, usuarioQueCancela , motivo);

        const updateData = this.modifToDB(pedido);

        // TODO: aumentar el stock de los productos del pedido
        
        await this.pedidoRepository.update(pedidoBase._id, updateData);

        return this.toOutputDTO(pedido);
    }


    async marcarEnviado(pedidoId) {

        const pedidoBase = await this.pedidoRepository.findById(pedidoId);
        if (!pedidoBase) {
            throw new PedidoNotFound();
        }
        const lista = [EstadoPedido.CANCELADO, EstadoPedido.ENTREGADO, EstadoPedido.ENVIADO];

        if (lista.includes(pedidoBase.estado)) {
            throw new Error('El pedido no puede ser marcado como enviado');
        }

        const pedido = Pedido.fromDB(pedidoBase);
        const usuarioQueEnvia = await this.usuariosRepository.findById(pedido.comprador);
        if (!usuarioQueEnvia) {
            throw new UsuarioNotExists('El usuario no existe');
        }

        // falta notificar al usuario que envía
        
        //const productos = pedido.items.map(item => item.producto);
        
        //productos.

        // TODO: aumentar la cantidad vendida de cada producto

        for (const item of pedido.items) {
            const producto = await this.productosRepository.findById(item.producto);
            if (!producto) {
                throw new EntidadNotFoundError("producto con id " + item.producto + " no encontrado");
            }
            producto.aumentarStock(item.cantidad);
            await this.productosRepository.update(producto._id, { cantidadVendida: producto.cantidadVendida });
        }

        pedido.actualizarEstado(EstadoPedido.ENVIADO, usuarioQueEnvia,null);

        const updateData = this.modifToDB(pedido);

        await this.pedidoRepository.update(pedidoBase._id, updateData);

        return this.toOutputDTO(pedido);
    }

    toOutputDTOs(pedidos){
        return pedidos.map(x=>this.toOutputDTO(x))
    }

    toOutputDTO(pedido) {
        return new PedidoOutputDTO(pedido);
    }

    /*
    marcarEnviado() {
        const estadosValidos = [EstadoPedido.CONFIRMADO, EstadoPedido.EN_PREPARACION];
        if (!estadosValidos.includes(this.estado)) {
        throw new Error('El pedido no puede ser marcado como enviado');
        }
        this.cambioDeEstado(EstadoPedido.ENVIADO);
        return console.log(`Pedido ${this.id} marcado como enviado`);
    }
*/
    modifToDB(pedido){
        return {
            estado: pedido.estado,
            historialEstados: pedido.historialEstados.map(ce => ({
                estado: ce.estado,
                usuarioId: ce.usuarioId ? ce.usuarioId.toString() : null,
                fecha: ce.fecha,
                motivo: ce.motivo
            })),
            total: pedido.total
        };
    }

    creacionToDB(nuevoPedido){
        return {
            comprador: nuevoPedido.comprador._id || nuevoPedido.comprador,
            items: nuevoPedido.items.map(item => ({
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            })),
            moneda: nuevoPedido.moneda,
            direccionEntrega: { ...nuevoPedido.direccionEntrega },
            estado: nuevoPedido.estado,
            fechaCreacion: nuevoPedido.fechaCreacion,
            historialEstados: nuevoPedido.historialEstados.map(ce => ({
                estado: ce.estado,
                usuario: ce.usuario._id || ce.usuario,
                fecha: ce.fecha,
                motivo: ce.motivo
            })),
            total: nuevoPedido.total
        };
    }
}