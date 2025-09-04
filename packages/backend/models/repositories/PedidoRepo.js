export class PedidoRepo {
  constructor() {
    this.pedidos = []
  }

  update = (id, nuevoPedido) => {
    this.pedidos = this.pedidos.map(p => p.id === id ? nuevoPedido : p)
  }

  findById = (id) => {
    this.pedidos.find(p => p.id === id)
  }
}