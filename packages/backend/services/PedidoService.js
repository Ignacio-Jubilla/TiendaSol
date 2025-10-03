import { PedidoNotFound } from "../errors/PedidosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";
import Pedido from "../models/Pedido.js";

export class PedidoService {
    constructor(PedidoRepository,UsuariosRepository) {
        this.pedidoRepository = PedidoRepository;
        this.usuariosRepository=UsuariosRepository;
    }
    async obtenerTodosLosPedidos() {
        return await this.pedidoRepository.findAll();
    }
    
    async crearPedido(pedidoInputDTO) {
        const usuario = await this.usuariosRepository.findById(pedidoInputDTO.compradorId);
        if (!usuario) {
            throw new Error('El usuario comprador no existe');
        }
        const nuevoPedido = new Pedido(usuario, pedidoInputDTO.items, 
            pedidoInputDTO.moneda, pedidoInputDTO.direccionEntrega);
        const pedidoGuardado = await this.pedidoRepository.save(nuevoPedido);
        return this.toOutputDTO(pedidoGuardado);
    }

    async cancelarPedido(pedidoId, motivo) {
        const pedido = await this.pedidoRepository.findById(pedidoId);
        if (!pedido) {
            throw new PedidoNotFound();
        }
        return pedido.cancelar(motivo);
    }

    async obtenerHistorialPedidos(usuarioId) {
        const pedidos = await this.pedidoRepository.findByUserId(usuarioId)
        return this.toOutputDTOs(pedidos)
    }

    async marcarEnviado(pedidoId) {
        const pedido = await this.pedidoRepository.findById(pedidoId);
        if (!pedido) {
            throw new PedidoNotFound();
        }
        return pedido.marcarEnviado();
    }

    toOutputDTOs(pedidos){
        return pedidos.map(x=>this.toOutputDTO(x))
    }

    toOutputDTO(pedido) {
        return new PedidoOutputDTO(pedido);
    }
}