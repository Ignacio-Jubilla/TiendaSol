class ProductoRepo {
constructor() {
    this.productos = []
  }

  update = (id, nuevoProducto) => {
    this.productos = this.productos.map(p => p.id === id ? nuevoProducto : p)
  }

  findById = (id) => {
    this.productos.find(p => p.id === id)
  }
}