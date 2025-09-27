import express from 'express'
export const productosRouter = express.Router();
import asyncHandler from 'express-async-handler'
import { ProductosController } from '../controllers/Productoscontroller.js';
import { ProductoService } from '../services/ProductoService.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepotisory.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';

const productoRepo = new ProductoRepository()
const usuarioRepo = new UsuarioRepository()
const categoriaRepo = new CategoriaRepository()

const productoService = new ProductoService(productoRepo, categoriaRepo, usuarioRepo)
const productosController = new ProductosController(productoService)

productosRouter.get('/', asyncHandler(async (req, res) => {
  return await productosController.obtenerProductos(req, res)
}))

productosRouter.post("/", asyncHandler(async(req, res) => {
  return await productosController.crearProducto(req, res)
}))
export default productosRouter