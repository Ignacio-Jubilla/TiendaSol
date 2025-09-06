import CambioEstadoPedido from "./CambioEstadoPedido.js";
import DireccionEntrega from "./DireccionEntrega.js";
import { EstadoPedido } from "./enums/EstadoPedido.js";
import { TipoUsuario } from "./enums/TipoUsuario.js";
import {Usuario} from "./Usuario.js";
import { v4 as uuidv4 } from 'uuid';


export class Pedido {
  static id = 0;
  constructor() { // por qué no pasar los parametros al constructor?
    this.id = uuidv4();
    this.comprador = new Usuario(null,null,null,TipoUsuario.COMPRADOR)
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
