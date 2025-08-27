import CambioEstadoPedido from "./CambioEstadoPedido";
import DireccionEntrega from "./DireccionEntrega";
class Pedido {
  constructor(comprador, items, moneda, direccionEntrega) {
    this.comprador = comprador; 
    this.items = items;
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = new Date()
    this.historialEstados = []
    this.total = items.reduce((acum, item) => acum + item.subtotal(), 0)
  }

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0);
  }

  actualizarEstado = (nuevoEstado, quien, motivo)  => {
    let cambio = new CambioEstadoPedido(nuevoEstado, this, quien, motivo)
    this.historialEstados.push(cambio)
    this.estado = nuevoEstado
  }

  validarStock = () => this.items.reduce((itemAnt, itemAct) => itemAnt && item.getProducto().estaDisponible(item.getCantidad()), true)
}