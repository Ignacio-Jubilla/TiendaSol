import express from 'express'
const itemPedidoRouter = express.Router()
import { ItemPedidoRepository } from '../models/repositories/ItemPedidoRepository.js'
import asyncHandler from 'express-async-handler';
import { ItemPedidoController } from '../controllers/ItemPedidoController.js';
import { ItemPedidoService} from '../services/ItemPedidoService.js'
import { PedidoService } from '../services/PedidoService.js';
import { PedidoRepository } from '../models/repositories/PedidoRepository.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import { NotificacionService } from '../services/NotificacionService.js';
import { NotificacionesRepository } from '../models/repositories/NotificacionesRepository.js';
import { FactoryNotificacion } from '../models/entities/FactoryNotificacion.js';
import { TraductorManual } from '../models/entities/TraductorManual.js';
import middleware from '../utils/middleware.js';


const pedidoRepository = new PedidoRepository()
const traductor = new TraductorManual()
const factoryNotificacion = new FactoryNotificacion(traductor)
const usuarioRepository = new UsuarioRepository()
const userRepository = new UsuarioRepository()
const notificacionesRepository = new NotificacionesRepository()
const productoRepository = new ProductoRepository()
const itemPedidoRepository = new ItemPedidoRepository()

const notificacionService = new NotificacionService(notificacionesRepository, usuarioRepository, factoryNotificacion, productoRepository)
const pedidoService = new PedidoService(pedidoRepository, itemPedidoRepository, userRepository, productoRepository, notificacionService)
const itemPedidoService = new ItemPedidoService(itemPedidoRepository, pedidoService, productoRepository)
const itemPedidoController = new ItemPedidoController(itemPedidoService)

itemPedidoRouter.get('/:id', middleware.extractUser, asyncHandler(async (req, res)=> {
  return await itemPedidoController.getItemPedido(req, res);
})) 

itemPedidoRouter.get('/', middleware.extractUser, asyncHandler(async (req,res) =>{
    return await itemPedidoController.getItemsPorVendedorId(req,res);
}))

itemPedidoRouter.patch('/:id', middleware.extractUser, asyncHandler(async (req, res) => {
  return await itemPedidoController.actualizarEstadoItemPedido(req, res);
}))


export default itemPedidoRouter