import { CambioEstadoPedido } from "./CambioEstadoPedido.js";
import { DireccionEntrega } from "./DireccionEntrega.js";
import { EstadoPedido } from "./enums/EstadoPedido.js";
import { TipoUsuario } from "./enums/TipoUsuario.js";
import {Usuario} from "./Usuario.js";
import { v4 as uuidv4 } from 'uuid';


export class Pedido {
  constructor(usuario,items,moneda,direccionEntrega) {
    this.comprador = usuario
    this.items = items
    this.total = this.calcularTotal();
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega
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

  validarStock = () => this.items.reduce((itemAnt, itemAct) => itemAnt && itemAct.getProducto().estaDisponible(itemAct.getCantidad()), true)
}
