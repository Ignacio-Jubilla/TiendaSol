import { NoPuedeEnviarseError, PedidoNotFound } from "../errors/PedidosErrors.js";
import { EntidadNotFoundError } from "../errors/ProductosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";

export class ItemPedidoService {
  constructor(ItemPedidoRepository, PedidoService, ProductosRepository) {
    this.itemPedidoRepository = ItemPedidoRepository;
    this.pedidoService = PedidoService;
    this.ProductosRepository = ProductosRepository;
  }
  async getItemPedidosByVendedorId({vendedorId, page, perPage}) {
    const itemPedidos = await this.itemPedidoRepository.findByVendedorId(vendedorId, page, perPage);
    return itemPedidos;
  }
  async getItemPedidoById(idItem) {
    const itemPedido = await this.findById(idItem);
    return itemPedido;
  }

  async marcarEnviado(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);

    if (!itemPedido) {
      throw new PedidoNotFound();
    }

    console.log("itemPedido:", itemPedido);

    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
    ];

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
    
    await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.ENVIADO);
  }

  async actualizarEstadoItemPedido(idPedido) {
    await this.pedidoService.verificarEstado(idPedido);
  }

  async cancelarItemPedido(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);

    if (!itemPedido) {
      throw new PedidoNotFound("Pedido de item no encontrado");
    }
    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
      EstadoPedido.EN_PREPARACION,
      EstadoPedido.CONFIRMADO
    ];

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
  
    //await this.actualizarEstadoItemPedido(itemPedido.idPedido);

           const productoId = itemPedido.producto;
            const producto = await this.ProductosRepository.findById(productoId);
            if (!producto) {
                throw new EntidadNotFoundError(`Producto con id ${productoId} no encontrado`);
            }

            producto.aumentarStock(itemPedido.cantidad);
            await this.ProductosRepository.updateProducto(
                productoId,
                {
                    stock: producto.stock
                }
            );
    const itemPEdidoUpdate = await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CANCELADO);
    await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return itemPEdidoUpdate;
  }

  async confirmarItemPedido(itemPedidoId) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);
    if (!itemPedido) {
      throw new PedidoNotFound();
    }
    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
      EstadoPedido.EN_PREPARACION
    ];
    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
    await this.actualizarEstadoItemPedido(itemPedido.idPedido);
    return await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CONFIRMADO);
  }
}
