import { PedidoNotFound } from "../errors/PedidosErrors.js";
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";
import { Pedido } from "../models/entities/Pedido.js";
import { PedidoOutputDTO } from "../models/entities/dtos/output/PedidoOutputDTO.js";
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
        const total = await this.pedidoRepository.contarTodos();
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
        console.log('Todos los productos están disponibles');
        const nuevoPedido = new Pedido(usuario, pedidoInputDTO.items, 
            pedidoInputDTO.moneda, pedidoInputDTO.direccionEntrega);
        try{
            let outputDTO = this.toOutputDTO(nuevoPedido);
        }catch(e){
            throw new Error('Error al crear el pedido: ' + e.message);
        }
        const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);
        return this.toOutputDTO(pedidoGuardado);
    }

    async cancelarPedido(pedidoId, motivo) {
        const lista = [EstadoPedido.PENDIENTE, EstadoPedido.EN_PREPARACION,EstadoPedido.CONFIRMADO];
        const pedido = await this.pedidoRepository.findById(pedidoId);
        const usuarioQueCancela = await this.usuariosRepository.findById(pedido.comprador.id);
        if (!pedido) {
            throw new PedidoNotFound();
        }
        if (!lista.includes(pedido.estado)) {
            throw new CancelationError();
        }
        // falta notif
        pedido.actualizarEstado(EstadoPedido.CANCELADO, usuarioQueCancela , motivo);
        await this.pedidoRepository.update(pedido);
        return this.toOutputDTO(pedido);
    }

    async obtenerHistorialPedidos(usuarioId) {
        const pedidos = await this.pedidoRepository.findByUserId(usuarioId);
        if (!pedidos || pedidos.length === 0) {
            throw new PedidoNotFound('No se encontraron pedidos para el usuario con id ' + usuarioId);
        }
        return this.toOutputDTOs(pedidos);
    }

    async marcarEnviado(pedidoId) {
        const pedido = await this.pedidoRepository.findById(pedidoId);
        if (!pedido) {
            throw new PedidoNotFound();
        }
        const usuarioQueEnvia = await this.usuariosRepository.findById(pedido.comprador.id);
        if (!usuarioQueEnvia) {
            throw new UsuarioNotExists('El usuario no existe');
        }
        pedido.actualizarEstado(EstadoPedido.ENVIADO, usuarioQueEnvia,null);
        await this.pedidoRepository.update(pedido);
        return console.log(`Pedido ${pedidoId} marcado como enviado`);
    }

    toOutputDTOs(pedidos){
        return pedidos.map(x=>this.toOutputDTO(x))
    }

    toOutputDTO(pedido) {
        return new PedidoOutputDTO(pedido);
    }

    marcarEnviado() {
        const estadosValidos = [EstadoPedido.CONFIRMADO, EstadoPedido.EN_PREPARACION];
        if (!estadosValidos.includes(this.estado)) {
        throw new Error('El pedido no puede ser marcado como enviado');
        }
        this.cambioDeEstado(EstadoPedido.ENVIADO);
        return console.log(`Pedido ${this.id} marcado como enviado`);
    }

}