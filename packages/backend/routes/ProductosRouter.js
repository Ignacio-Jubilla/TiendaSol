import express from 'express'
export const productosRouter = express.Router();
import asyncHandler from 'express-async-handler'
import { ProductosController } from '../controllers/ProductosController.js';
import { ProductoService } from '../services/ProductoService.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';
import { obtenerTipoCambio } from '../utils/exchangeApiExternal.js';
import multer from "multer"
import fs from "fs"
import path from 'path';
import { InputValidationError } from '../errors/ProductosErrors.js';
import { v4 as uuidv4 } from "uuid";
import middleware from '../utils/middleware.js';
//configuracion multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
   filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new InputValidationError('Solo se permite subir imagenes'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB por archivo
});

const productoRepo = new ProductoRepository()
const categoriaRepo = new CategoriaRepository()
const usuarioRepo = new UsuarioRepository()
const tiposCambio = await obtenerTipoCambio()
const productoService = new ProductoService(productoRepo, categoriaRepo, usuarioRepo, tiposCambio)
const productosController = new ProductosController(productoService)

productosRouter.get('/categorias', asyncHandler(async (req, res) => {
  return await productosController.obtenerCategorias(req, res)
}))

productosRouter.get('/', asyncHandler(async (req, res) => {
  return await productosController.obtenerProductos(req, res)
}))

productosRouter.get('/:id', asyncHandler(async(req, res) => {
  return await productosController.obtenerProductoId(req, res)
}))

productosRouter.post("/", middleware.extractUser,upload.array("imagenes", 5), asyncHandler(async(req, res) => {
  return await productosController.crearProducto(req, res)
}))

productosRouter.put("/:id", asyncHandler(async(req, res) => {
  return await productosController.modificarProducto(req, res)
}))
export default productosRouter