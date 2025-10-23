//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import express from 'express';
const pedidosRouter = express.Router();
import { PedidosController} from '../controllers/PedidosController.js'
import { PedidoService } from '../services/PedidoService.js';

/*
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO';
import ProductoService from '../services/ProductoService';
import UsuarioService from '../services/UsuarioService';
import NotificacionService from '../services/NotificacionService';
const pedidoService = new PedidosServices(new ProductoService(), new UsuarioService(), new NotificacionService());
*/
import { UsuarioRepository } from '../models/repositories/UsuariosRepository.js';
import { PedidoRepository } from '../models/repositories/PedidoRepository.js';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import asyncHandler from 'express-async-handler';
const usuarioRepo = new UsuarioRepository();
const pedidoRepo = new PedidoRepository();
const productoRepo = new ProductoRepository();
const pedidosService = new PedidoService(pedidoRepo, usuarioRepo, productoRepo);

const pedidosController = new PedidosController(pedidosService);

pedidosRouter.get('/', asyncHandler(async (req, res) => {
  return await pedidosController.obtenerTodosLosPedidos(req, res);
}))

pedidosRouter.post('/', asyncHandler(async (req, res) => {
  return await pedidosController.crearPedido(req, res);
}))

pedidosRouter.put('/:id/cancelado', asyncHandler(async (req, res) => {
  return await pedidosController.cancelarPedido(req, res);
}))

pedidosRouter.get('/usuario/:id/historial', asyncHandler(async (req, res) => {
  return await pedidosController.obtenerHistorialPedidos(req, res);
}))

pedidosRouter.put('/:id/enviado', asyncHandler( async (req, res) => {
  return await pedidosController.marcarEnviado(req, res);
}))



export default pedidosRouter