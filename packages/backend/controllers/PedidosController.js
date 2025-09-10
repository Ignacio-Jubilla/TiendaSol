//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import express from 'express';
export const PedidosRouter = express.Router();
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
/*
import PedidosServices from '../services/PedidoService';
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO';
import ProductoService from '../services/ProductoService';
import UsuarioService from '../services/UsuarioService';
import NotificacionService from '../services/NotificacionService';
const pedidoService = new PedidosServices(new ProductoService(), new UsuarioService(), new NotificacionService());
*/
const direccionEntregaBuilder = new DireccionEntregaBuilder();

PedidosRouter.post('/', (req, res) => {
  const body = req.body;
  
  const direccionEntrega = direccionEntregaBuilder
  .withCalle(body.calle)
    .withCodigoPostal(body.codigoPostal)
    .withDepartamento(body.departamento)
    .withLocalidad(body.localidad)
    .withNumero(body.numero)
    .withPais(body.pais)
    .withProvincia(body.provincia)
    .build()

  if (!body.compradorId || !body.items || !body.moneda ) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const pedidoDTO = new PedidoDTO(body.compradorId, body.items, body.moneda, direccionEntrega)
  pedidoService.crearPedido(pedidoDTO)
  res.status(201).json("Pedido creado")
})

PedidosRouter.post('/:id/enviado', (req, res) => {
  const pedidoId = req.params.id
  if (!pedidoId) {
    return res.status(400).json({ error: 'Falta id de pedido' });
  }
  pedidoService.marcarEnviado(pedidoId)
})

PedidosRouter.post('/:id/cancelado', (req, res) => {
  const pedidoId = req.params.id
  const { motivo } = req.body
  if (!pedidoId) {
    return res.status(400).json({ error: 'Falta id de pedido' });
  }
  pedidoService.cancelarPedido(pedidoId, motivo);
})