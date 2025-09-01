export default class ProductoService {
  constructor() {
    this.productoRepository = new ProductoRepo()
  }

  findById = (id) => this.productoRepository.findById(id)
}