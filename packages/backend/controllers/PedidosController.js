export const PedidosRouter = require('express').Router()
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega';
import PedidosServices from '../services/PedidoService';
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO';
import ProductoService from '../services/ProductoService';
import UsuarioService from '../services/UsuarioService';
import NotificacionService from '../services/NotificacionService';
const pedidoService = new PedidosServices(new ProductoService(), new UsuarioService(), new NotificacionService());
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

  const pedidoDTO = new PedidoDTO(body.compradorId, body.items, body.moneda, direccionEntrega)
  pedidoService.crearPedido(pedidoDTO)
  res.status(201).json("Pedido creado")
})

PedidosRouter.post('/:id/marcarEnviado', (req, res) => {
  const {pedidoId} = req.params
  pedidoService.marcarEnviado(pedidoId)
})

PedidosRouter.post('/:id/cancelar', (req, res) => {
  const { pedidoId } = req.params
  const { motivo } = req.body
  pedidoService.cancelarPedido(pedidoId, motivo);
})