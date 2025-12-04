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

    crearSegunPedido(pedido, usuario){
      let mensajeEstado = this.crearSegunEstadoPedido(pedido.estado, usuario.tipo)
      let mensaje

      const productosEnString = pedido.items.map( item => `x${item.cantidad} ${item.producto.titulo}` ).join("; ")
      
      let compradorVendedor = "";

      if(usuario.vendedor) {
          compradorVendedor = `Vendedor: ${usuario.vendedor}`
      } else if (usuario.comprador) {
        compradorVendedor = `Comprador: ${usuario.comprador}`
      }

      mensaje = `${mensajeEstado}\nPedido: ${pedido._id} ${compradorVendedor} Items: ${productosEnString}` 

      const notificacion = new Notificacion(usuario.destino,mensaje);
      return notificacion
    }

    cambiarLenguaje = (nuevoLenguaje) => {
      this.lenguaje = nuevoLenguaje
    }
}