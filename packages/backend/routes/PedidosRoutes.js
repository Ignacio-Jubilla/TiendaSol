//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import express from 'express';
const pedidosRouter = express.Router();
import { PedidosController} from '../controllers/PedidosController.js'
/*
import PedidosServices from '../services/PedidoService';
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO';
import ProductoService from '../services/ProductoService';
import UsuarioService from '../services/UsuarioService';
import NotificacionService from '../services/NotificacionService';
const pedidoService = new PedidosServices(new ProductoService(), new UsuarioService(), new NotificacionService());
*/
const pedidosController = new PedidosController();

pedidosRouter.post('/', (req, res) => {
  pedidosController.crearPedido(req, res);
})

pedidosRouter.put('/:id/cancelado', (req, res) => {
  pedidosController.cancelarPedido(req, res);
})

pedidosRouter.get('/usuario/:id/historial', (req, res) => {
  pedidosController.obtenerHistorialPedidos(req, res);
})

pedidosRouter.put('/:id/enviado', (req, res) => {
  pedidosController.marcarEnviado(req, res);
})



export default pedidosRouter