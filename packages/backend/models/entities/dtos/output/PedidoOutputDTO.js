export class PedidoOutputDTO{
  constructor(pedido) {
    this.id = pedido._id,
    this.compradorId = pedido.comprador,
    this.items = pedido.items.map(item => ({
      productoId: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario
    })),
    this.total = pedido.total,
    this.moneda = pedido.moneda,
    this.direccionEntrega = { ...pedido.direccionEntrega },
    this.estado = pedido.estado,
    this.fechaCreacion = pedido.fechaCreacion,
    this.historialEstados = pedido.historialEstados
  }
}