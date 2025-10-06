import { ProductoRepository } from '../models/repositories/ProductosRepository.js'
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js'
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js'
import { EntidadNotFoundError, InputValidationError } from '../errors/ProductosErrors.js'
import { Producto } from '../models/entities/Producto.js'
import mongoose, { mongo, Mongoose } from 'mongoose'
import { Categoria } from '../models/entities/Categoria.js'
import expressAsyncHandler from 'express-async-handler'
import { ConversorMonedas } from '../utils/conversorMonedas.js'
import tiposCambioManual from './../utils/tiposCambioManual.js'
export class ProductoService {
  constructor(productoRepo, categoriaRepo, usuarioRepo, tiposCambio) {
    this.productoRepo = productoRepo
    this.categoriaRepo = categoriaRepo
    this.usuarioRepo = usuarioRepo
    this.tiposCambio = tiposCambio || tiposCambioManual
    this.conversorMonedas = new ConversorMonedas(this.tiposCambio)
  }
  toDto(producto) {
    return {
      ...producto,
      _id: producto.id?.toString() || producto._id?.toString(),
      vendedor : {
        id: producto.vendedor.id?.toString() || producto.vendedor._id?.toString(),
        nombre: producto.vendedor.nombre, 
        email: producto.vendedor.email
      }
    }
  }
  async crearProducto(productoDto) {
    if (!mongoose.isValidObjectId(productoDto.vendedorId)) {
      throw new InputValidationError("vendedorId no es un id valido")
    }
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
  async obtenerProducto(idProducto) {
    const producto = await this.productoRepo.findById(idProducto)
    if (!producto) throw new EntidadNotFoundError("producto con id " + idProducto + " no encontrado")
    return producto
  }
  async obtenerProductos(filtro) {
    const query = {}
    const sort = {}
    const vendedor = await this.usuarioRepo.findById(filtro.vendedorId)
    if (!vendedor) {
      throw new EntidadNotFoundError(`usuario con id ${filtro.vendedorId} no encontrado`)
    }

    query.vendedor = new mongoose.Types.ObjectId(vendedor.id)

    //buscar por valor busqueda
    if (filtro.valorBusqueda) {
      const regex = new RegExp(filtro.valorBusqueda, "i");
      query.$or = [
        { "titulo": regex },
        { "descripcion": regex },
        { "categorias.nombre": regex }
      ];
    }

  
    if (filtro.ordenarPor === "VENTAS") {
      sort.totalVentas = -1
    }

    let productos = await this.productoRepo.getProductos(query, sort)

    if (filtro.ordenarPor === "PRECIO") {
      //ordeno por precio en diferentes monedas
      productos.sort((a, b) => {
        let precioA = a.precio
        let precioB = b.precio
        if (a.moneda !== b.moneda) {
            precioB = this.conversorMonedas.convertir(b.moneda, a.moneda, precioB)
          }
        if (filtro.ordenPrecio === "DESC") return precioB - precioA
        if (filtro.ordenPrecio === "ASC") return precioA - precioB
      });
    }

    if (filtro.precioMin || filtro.precioMax) {
      if (filtro.precioMin) {
        productos = productos.filter(p => {
          if (filtro.tipoMoneda === p.moneda) return p.precio >= filtro.precioMin
          else {
            return p.precio >= this.conversorMonedas.convertir(filtro.tipoMoneda, p.moneda, filtro.precioMin)
          }
        }
        )
      }
      if (filtro.precioMax) {
        productos = productos.filter(p => {
          if (filtro.tipoMoneda === p.moneda) return p.precio <= filtro.precioMax
          else {
            return p.precio <= this.conversorMonedas.convertir(filtro.tipoMoneda, p.moneda, filtro.precioMax)
          }
        }
        )
      }
    }

    let page = filtro.page ? Number(filtro.page) : 1;
    let perPage = filtro.perPage ? Number(filtro.perPage) : 30;

    const total = productos.length
    const totalPages = Math.ceil(total / perPage)
    if (page > totalPages) {
      page = 1;
      perPage = 30;
    }
    const skipPages = (page - 1) * perPage;
    const paginados = productos.slice(skipPages, skipPages + perPage)
    return {
      productos: paginados,
      page,
      perPage,
      totalPages
    }
  }
}