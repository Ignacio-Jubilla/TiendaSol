export class ItemPedido{
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.estado;
    this.idPedido;
    this.vendedorId = this.vendedorId;
  }

  getCantidad = () => this.cantidad
  getProducto = () => this.producto
  subtotal = () => this.precioUnitario * this.cantidad

  cambiarEstado = (nuevoEstado) => {
    this.estado = nuevoEstado
  }


}