import CambioEstadoPedido from "./CambioEstadoPedido";
import DireccionEntrega from "./DireccionEntrega";
import Usuario from "./Usuario";
import { v4 as uuidv4 } from 'uuid';


class Pedido {
  static id = 0;
  constructor(comprador, items, moneda, direccionEntrega) {
    this.id = uuidv4();
    this.comprador = comprador; 
    this.items = items;
    this.total = this.calcularTotal();
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = new Date();
    this.historialEstados = [];
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

export default Pedido