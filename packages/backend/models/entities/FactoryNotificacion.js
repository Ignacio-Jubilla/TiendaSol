import {EstadoPedido} from "./enums/EstadoPedido.js"
import {Pedido} from "./Pedido.js"
import {Notificacion} from "./Notificacion.js"

export class FactoryNotificacion{
    constructor(traductor) {
      this.lenguaje = "ES"
      this.traductor = traductor
    }

    crearSegunEstadoPedido = (estadoPedido, tipoUsuario) => {
      return this.traductor.traducir(estadoPedido, this.lenguaje, tipoUsuario)
    }

    crearSegunPedido(pedido, usuarioDestino){
      let mensajeEstado = this.crearSegunEstadoPedido(pedido.items[0].estado, usuarioDestino.tipo)
      let mensaje

      const productosEnString = pedido.items.map( item => `x${item.cantidad} ${item.producto.titulo}` ).join("; ")
      
      if(usuarioDestino.tipo == "COMPRADOR"){
        let vendedor = ""
        if(usuarioDestino.vendedor){
          vendedor = `Vendedor: ${usuarioDestino.vendedor}`
        }

        mensaje = `${mensajeEstado}\nPedido: ${pedido._id} ${vendedor} Items: ${productosEnString}` 

      } else {
        mensaje = `${mensajeEstado}\nPedido: ${pedido._id} Comprador: ${usuarioDestino.comprador} Items: ${productosEnString}` 
      }

      const notificacion = new Notificacion(usuarioDestino.destino,mensaje);
      return notificacion
    }

    cambiarLenguaje = (nuevoLenguaje) => {
      this.lenguaje = nuevoLenguaje
    }
}