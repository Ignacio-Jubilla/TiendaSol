class CambioEstadoPedido {
  constructor(estado, pedido, usuario, motivo){
    this.fecha = new Date()
    this.estado = estado 
    this.pedido = pedido 
    this.motivo = motivo
    this.usuario = usuario
  }
}
 export default CambioEstadoPedido