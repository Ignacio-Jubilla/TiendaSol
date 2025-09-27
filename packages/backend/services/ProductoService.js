import { ProductoRepository } from '../models/repositories/ProductosRepository.js'
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js'
import { UsuarioRepository } from '../models/repositories/UsuariosRepotisory.js'
import { EntidadNotFoundError, InputValidationError } from '../errors/ProductosErrors.js'
import { Producto } from '../models/entities/Producto.js'
import mongoose from 'mongoose'
import { Categoria } from '../models/entities/Categoria.js'
import expressAsyncHandler from 'express-async-handler'

export class ProductoService {
  constructor(productoRepo, categoriaRepo, usuarioRepo) {
    this.productoRepo = productoRepo
    this.categoriaRepo = categoriaRepo
    this.usuarioRepo = usuarioRepo
  }
  async crearProducto(productoDto) {
    const vendedor = await this.usuarioRepo.findById(productoDto.vendedorId)
    if (!vendedor) { throw new EntidadNotFoundError(`usuario con id ${productoDto.vendedorId} no encontrado`) }

    const categorias = [];
    for (const nombreCategoria of productoDto.categorias) {
      let categoria = await this.categoriaRepo.findByNombre(nombreCategoria);
      if (!categoria) {
        throw new EntidadNotFoundError(`categoria ${nombreCategoria} no encontrada`)
      }
      categorias.push(categoria);
    }

    const producto = new Producto(vendedor, productoDto.titulo, productoDto.descripcion, categorias, productoDto.precio, productoDto.moneda, productoDto.stock, productoDto.fotos || [])
    return await this.productoRepo.saveProducto(producto)
  }
  async obtenerProductos(filtro) {
    console.log(filtro)
    const query = {}
    const sorting = {}
    const vendedor = await this.usuarioRepo.findById(filtro.vendedorId)

    if (!vendedor) {
      throw new EntidadNotFoundError(`usuario con id ${filtro.vendedorId} no encontrado`)
    }


    query.vendedor = new mongoose.Types.ObjectId(vendedor.id)
    if (filtro.precioMin || filtro.precioMax) {
      query.precio = {};
      if (filtro.precioMin) query.precio.$gte = Number(filtro.precioMin);
      if (filtro.precioMax) query.precio.$lte = Number(filtro.precioMax);
    }
    //buscar por valor busqueda
    if (filtro.valorBusqueda) {
      const regex = new RegExp(filtro.valorBusqueda, "i");
      query.$or = [
        { "titulo": regex },
        { "descripcion": regex },
        { "categorias.nombre": regex }
      ];
    }

    //agrego filtro itemPedido
    //    ordenarPor: z.enum(["PRECIO", "VENTAS"]).optional(),
    if (filtro.ordenarPor === "VENTAS") {
      sorting.totalVentas = -1
    } else if (filtro.ordenarPor === "PRECIO") {
      if (filtro.ordenPrecio === "DESC") {
        sorting.precio = -1
      } else if (filtro.ordenPrecio === "ASC") {
        sorting.precio = 1
      } else if (filtro.ordenPrecio) {
        throw new InputValidationError(`orden de precio ${filtro.ordenPrecio} no soportado`)
      }
    }

    const page = filtro.page ? Number(filtro.page) : 1;
    const perPage = filtro.perPage ? Number(filtro.perPage) : 30;
    return await this.productoRepo.getProductos(query, sorting, page, perPage)
  }
}