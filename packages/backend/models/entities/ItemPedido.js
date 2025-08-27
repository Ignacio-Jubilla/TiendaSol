class ItemPedido{
  constructor(producto, cantidad, precioUnitario){
    this.producto
    this.cantidad
    this.precioUnitario
  }

  getCantidad = () => this.cantidad
  getProducto = () => this.producto
  subtotal = () => precioUnitario * cantidad
}