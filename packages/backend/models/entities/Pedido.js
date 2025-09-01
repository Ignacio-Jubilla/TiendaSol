import CambioEstadoPedido from "./CambioEstadoPedido";
import DireccionEntrega from "./DireccionEntrega";
import { EstadoPedido } from "./enums/EstadoPedido";
import Usuario from "./Usuario";
import { v4 as uuidv4 } from 'uuid';


export class Pedido {
  static id = 0;
  constructor() {
    this.id = uuidv4();
    this.comprador = null
    this.items = []
    this.total = this.calcularTotal();
    this.moneda = null;
    this.direccionEntrega = null
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = new Date();
    this.historialEstados = [];
  }
  getComprador = () => this.comprador
  getItems = () => this.items
  getMoneda = () => this.moneda
  getDireccionEntrega = () => this.direccionEntrega

  setComprador = (comprador) => {this.comprador = comprador}
  agregarItem = (item) => {this.items.push(item)}
  setMoneda = (moneda) => {this.moneda = moneda}
  setDireccionEntrega = (dirEntrega) => {this.direccionEntrega = dirEntrega}

  calcularTotal() {
    return this.items.reduce((acum, item) => acum + item.subtotal(), 0);
  }

  actualizarEstado = (nuevoEstado, quien, motivo)  => {
    this.historialEstados.push(this.estado)
    let cambio = new CambioEstadoPedido(nuevoEstado, this, quien, motivo)
    this.estado = nuevoEstado
  }

  validarStock = () => this.items.reduce((itemAnt, itemAct) => itemAnt && item.getProducto().estaDisponible(item.getCantidad()), true)
}

export default Pedido