import express from 'express'
export const productosRouter = express.Router();
import asyncHandler from 'express-async-handler'
import { ProductosController } from '../controllers/Productoscontroller.js';
import { ProductoService } from '../services/ProductoService.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';
import { obtenerTipoCambio } from '../utils/exchangeApiExternal.js';
const productoRepo = new ProductoRepository()
const categoriaRepo = new CategoriaRepository()
const usuarioRepo = new UsuarioRepository()
const tiposCambio = await obtenerTipoCambio()
const productoService = new ProductoService(productoRepo, categoriaRepo, usuarioRepo, tiposCambio)
const productosController = new ProductosController(productoService)

productosRouter.get('/', asyncHandler(async (req, res) => {
  return await productosController.obtenerProductos(req, res)
}))

productosRouter.get('/:id', asyncHandler(async(req, res) => {
  return await productosController.obtenerProductoId(req, res)
}))
productosRouter.post("/", asyncHandler(async(req, res) => {
  return await productosController.crearProducto(req, res)
}))
export default productosRouter