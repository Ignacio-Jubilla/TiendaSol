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

const app = express();

app.listen(3000,() =>{
    console.log("Servidor corriendo sobre el puerto 3000");
})

app.get("/api/health", (req,res) =>{
    res.status(200).json({
        status: "ok",
        message: "Tienda sol API Health Check EXITOSO",
        timestamp: new Date().toLocaleString()
    });
});



PedidosRouter.post('/pedido', (req, res) => {
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

PedidosRouter.post('/pedido/:id/enviado', (req, res) => {
  const {pedidoId} = req.params
  pedidoService.marcarEnviado(pedidoId)
})

PedidosRouter.post('/pedido/:id/cancelado', (req, res) => {
  const { pedidoId } = req.params
  const { motivo } = req.body
  pedidoService.cancelarPedido(pedidoId, motivo);
})