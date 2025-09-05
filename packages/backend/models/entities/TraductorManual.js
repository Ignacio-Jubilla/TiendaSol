export class TraductorManual{
  constructor() {
    this.mensajes = {
      "ENVIADO": {
      ES: "Tu pedido ha sido enviado",
      EN: "Your order has been shipped",
      BR: "Peido emviado",
      },
      "PENDIENTE":{
        ES: "Tu pedido esta pendiente",
        EN: "Pending order",
        BR: "pedido",
      },
      "CANCELADO":{
        ES: "Tu pedido ha sido cancelado",
        EN: "Your order has been cancelled",
        BR: "pedido",
      },
      "CONFIRMADO":{
        ES: "Tu pedido fue confirmado",
        EN: "Your order is confirmed",
        BR: "pedido",
      },
      "EN PREPARACION":{
        ES: "Tu pedido esta en preparacion",
        EN: "We are preparing your order, soon we'll send it",
        BR: "pedido",
      },
      "ENTREGADO":{
        ES: "Tu pedido fue entregado",
        EN: "Your order was shipped",
        BR: "pedido",
      }
    }
  }
  traducir = (estado, idioma) => {
    const mensaje = this.mensajes[estado].idioma 
    mensaje === undefined ? "Idioma no soportado, Not supported language" : mensaje
  }
}