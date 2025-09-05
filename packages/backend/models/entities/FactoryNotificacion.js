import { EstadoPedido } from "./enums/EstadoPedido";


export default class FactoryNotificacion{
    constructor(traductor) {
      this.lenguaje = "ES"
      this.traductor = traductor
    }

    crearSegunEstadoPedido = (estadoPedido) => {
        return this.traductor.traducir(estadoPedido, this.lenguaje)
    }

    crearSegunPedido(pedido){
      //TODO
    }

    cambiarLenguaje = (nuevoLenguaje) => {
      this.lenguaje = nuevoLenguaje
    }
}