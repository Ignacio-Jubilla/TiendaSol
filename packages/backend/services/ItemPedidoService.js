import { NotAuthorizedError } from "../errors/AuthErrors.js";
import { NoPuedeEnviarseError, PedidoNotFound } from "../errors/PedidosErrors.js";
import { EntidadNotFoundError } from "../errors/ProductosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";

export class ItemPedidoService {
  constructor(ItemPedidoRepository, PedidoService, ProductosRepository, notificacionesService) {
    this.itemPedidoRepository = ItemPedidoRepository;
    this.pedidoService = PedidoService;
    this.ProductosRepository = ProductosRepository;
    this.notificacionesService = notificacionesService;
  }
  async getItemPedidosByVendedorId({vendedorId, page, perPage}) {
    const itemPedidos = await this.itemPedidoRepository.findByVendedorId(vendedorId, page, perPage);
    return itemPedidos;
  }
  async getItemPedidoById(idItem) {
    const itemPedido = await this.itemPedidoRepository.findById(idItem);
    if (!itemPedido) {
      throw new PedidoNotFound("ItemPedido con id " + idItem + " no encontrado");
    }
    return this.itemPedidoToDto(itemPedido)
  }

  async marcarEnviado(itemPedidoId, idVendedor) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId);

    if (!itemPedido) {
      throw new PedidoNotFound();
    }

    if (itemPedido.vendedorId.toString() !== idVendedor) {
      throw new NotAuthorizedError("El vendedor no tiene permiso para actualizar este item de pedido");
    }

    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
    ];

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }
    
    const itemPEdidoUpdate = await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.ENVIADO)
    await this.actualizarEstadoItemPedido(itemPedido.idPedido._id)
    return itemPEdidoUpdate;
  }

  async actualizarEstadoItemPedido(idPedido) {
    await this.pedidoService.verificarEstado(idPedido);
  }

  async cancelarItemPedido(itemPedidoId, usuario) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId)
    
    if (!itemPedido) {
      throw new PedidoNotFound("Pedido de item no encontrado");
    }
    console.log('itemPedido: ' , itemPedido);
    const itemPedidoCompradorId = itemPedido.idPedido.comprador.toString();
    const itemPedidoVendedorId = itemPedido.vendedorId.toString();

    const esComprador  = (usuario.id === itemPedidoCompradorId);
    const esVendedor = (usuario.id === itemPedidoVendedorId)
    if (!esComprador && !esVendedor) {
      throw new NotAuthorizedError("El usuario no tiene permiso para actualizar este item de pedido");
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
            )
    const itemPEdidoUpdate = await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CANCELADO)
    await this.actualizarEstadoItemPedido(itemPedido.idPedido._id)

    await this.notificacionesService.crearNotificacionItemPedido(itemPEdidoUpdate, usuario)
    
    return itemPEdidoUpdate;
  }

  async marcarEnPreparacion(itemPedidoId, idUsuario) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId)

    if (!itemPedido) {
      throw new PedidoNotFound("Pedido de item no encontrado")
    } 
    if (itemPedido.vendedorId.toString() !== idUsuario) {
      throw new NotAuthorizedError("El usuario no tiene permiso para actualizar este item de pedido");
    }

    const lista = [
      EstadoPedido.CANCELADO,
      EstadoPedido.ENTREGADO,
      EstadoPedido.ENVIADO,
    ]

    if (lista.includes(itemPedido.estado)) {
      throw new NoPuedeEnviarseError();
    }

    const itemPEdidoUpdate = await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.EN_PREPARACION)
    await this.actualizarEstadoItemPedido(itemPedido.idPedido._id)
    return itemPEdidoUpdate
  }

  async confirmarItemPedido(itemPedidoId, idUsuario) {
    const itemPedido = await this.itemPedidoRepository.findById(itemPedidoId)

    if (!itemPedido) {
      throw new PedidoNotFound("Pedido de item no encontrado")
    }

    if (itemPedido.vendedorId.toString() !== idUsuario) {
      throw new NotAuthorizedError("El usuario no tiene permiso para actualizar este item de pedido");
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
    
    const itemPEdidoUpdate = await this.itemPedidoRepository.updateEstado(itemPedidoId, EstadoPedido.CONFIRMADO)
    await this.actualizarEstadoItemPedido(itemPedido.idPedido._id)
    return itemPEdidoUpdate;
  }

  itemPedidoToDto(itemPedido) {
    return {
      id: itemPedido._id,
      producto: itemPedido.producto,
      cantidad: itemPedido.cantidad,
      precioUnitario: itemPedido.precioUnitario,
      estado: itemPedido.estado,
      vendedorId: itemPedido.vendedorId,
      direccionEntrega: itemPedido.idPedido.direccionEntrega,
      compradorId: itemPedido.idPedido.comprador,
      fechaCreacion: itemPedido.idPedido.fechaCreacion
    };
  }
}
