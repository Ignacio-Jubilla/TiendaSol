//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
import { PedidoInputDTO } from '../models/entities/dtos/input/PedidoInputDTO.js';
import { PedidoOutputDTO } from '../models/entities/dtos/output/PedidoOutputDTO.js';
import express from 'express';
const direccionEntregaBuilder = new DireccionEntregaBuilder();

export class PedidosController {
 constructor(pedidoService) {
   this.pedidoService = pedidoService;
 }
  obtenerTodosLosPedidos = async (req, res) => {
    try {
      const pedidos = await this.pedidoService.obtenerTodosLosPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }

  crearPedido = async (req, res) => {
    try{
    const body = req.body;

    const direccionEntrega = direccionEntregaBuilder
     .withCalle(body.calle)
     .withAltura(body.altura)
     .withDepartamento(body.departamento)
     .withCodigoPostal(body.codigoPostal)
     .withCiudad(body.ciudad)
     .withProvincia(body.provincia)
     .withPais(body.pais)
     .build();

    if (!body.compradorId || !body.items || !body.moneda) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const pedidoInputDTO = new PedidoInputDTO(body.compradorId, body.items, body.moneda, direccionEntrega);
    const nuevoPedido = await this.pedidoService.crearPedido(pedidoInputDTO);
    res.status(200).json(nuevoPedido);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }
  
  cancelarPedido = async (req, res) => {
  try {
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
  } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }

  obtenerHistorialPedidos = async (req, res) => {
    try {
      const usuarioId = req.params.id;
      if (!usuarioId) {
        return res.status(400).json({ error: 'id de usuario no valido' });
      }
      const historial = await pedidoService.obtenerHistorialPedidos(usuarioId);
      res.status(200).json(historial);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
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

