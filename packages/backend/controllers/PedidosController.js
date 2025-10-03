//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
import { PedidoDTO } from '../models/entities/dtos/input/PedidoInputDTO.js';
import express from 'express';
const direccionEntregaBuilder = new DireccionEntregaBuilder();

export class PedidosController {
 constructor(pedidoService) {
   this.pedidoService = pedidoService;
 }

  crearPedido = async (req, res) => {
   const body = req.body;

   const direccionEntrega = direccionEntregaBuilder
     .withCalle(body.calle)
     .withCodigoPostal(body.codigoPostal)
     .withDepartamento(body.departamento)
     .withLocalidad(body.localidad)
     .withNumero(body.numero)
     .withPais(body.pais)
     .withProvincia(body.provincia)
     .build();

    if (!body.compradorId || !body.items || !body.moneda) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const pedidoInputDTO = new PedidoInputDTO(body.compradorId, body.items, body.moneda, direccionEntrega);
    const nuevoPedido = await pedidoService.crearPedido(pedidoInputDTO);
    res.status(200).json(nuevoPedido);
  }

  cancelarPedido = async (req, res) => {
    const pedidoId = req.params.id
    const { motivo } = req.body
    if (!pedidoId) {
      return res.status(400).json({ error: 'Falta id de pedido' });
    }
    const resultado = await pedidoService.cancelarPedido(pedidoId, motivo);
    if(!resultado) {
      return res.status(500).json({ error: 'error de cancelacion' });
    }
    res.status(200).json(resultado);
  }

  obtenerHistorialPedidos = async (req, res) => {
    const usuarioId = req.params.id
    if (!usuarioId) {
      return res.status(400).json({ error: 'id de usuario no valido' });
    }
    const historial = await pedidoService.obtenerHistorialPedidos(usuarioId)
    res.status(200).json(historial);
  }

  marcarEnviado = async (req, res) => {
    const pedidoId = req.params.id
    if (!pedidoId) {
      return res.status(400).json({ error: 'id de pedido no valido' });
    }
    const pedidoEnviado = await pedidoService.marcarEnviado(pedidoId)
    res.status(200).json(pedidoEnviado);
  }

}

