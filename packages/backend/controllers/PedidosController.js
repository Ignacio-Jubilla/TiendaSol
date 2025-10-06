//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                  no se puede mezclar import y require  
import { z } from 'zod'
import mongoose from 'mongoose';
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
import { PedidoInputDTO } from '../models/entities/dtos/input/PedidoInputDTO.js';
import { PedidoOutputDTO } from '../models/entities/dtos/output/PedidoOutputDTO.js';
import express from 'express';
import { itemPedidoSchema } from '../models/schemas/ItemPedidoModel.js';
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
    let body = req.body;

    const parsedBody = crearPedidoSchema.safeParse(body);
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues);
    }

    body = parsedBody.data;

    const direccionEntrega = direccionEntregaBuilder
     .withCalle(body.calle)
     .withAltura(body.altura)
     .withDepartamento(body.departamento)
     .withCodigoPostal(body.codigoPostal)
     .withCiudad(body.ciudad)
     .withProvincia(body.provincia)
     .withPais(body.pais)
     .build();


    const pedidoInputDTO = new PedidoInputDTO(body.compradorId, body.items, body.moneda, direccionEntrega);
    const nuevoPedido = await this.pedidoService.crearPedido(pedidoInputDTO);
    res.status(200).json(nuevoPedido);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
  }
  }
  
  cancelarPedido = async (req, res) => {
  try {
    let pedidoId = req.params.id
    const parsePedidoId = idSchema.safeParse(pedidoId);
    if (parsePedidoId.error) {
      return res.status(400).json(parsePedidoId.error.issues);
    }
    pedidoId = parsePedidoId.data;

    const parseBody = cancelarPedidoSchema.safeParse(req.body);
    if (parseBody.error) {
      return res.status(400).json(parseBody.error.issues);
    }

    const {motivo} = parseBody.data

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
      const parseParams = idSchema.safeParse(req.params.id);
      if (parseParams.error) {
        return res.status(400).json(parseParams.error.issues);
      }
      const usuarioId = parseParams.data;

      const historial = await pedidoService.obtenerHistorialPedidos(usuarioId);
      res.status(200).json(historial);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }
  

  marcarEnviado = async (req, res) => {
    try {
      const parseParams = idSchema.safeParse(req.params.id);
      if (parseParams.error) {
        return res.status(400).json(parseParams.error.issues);
      }
      const pedidoId = parseParams.data;

      const pedidoEnviado = await pedidoService.marcarEnviado(pedidoId);
    res.status(200).json(pedidoEnviado);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
    }
  }

}

const crearPedidoSchema = z.object({
  compradorId: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: "Id de comprador no válido",
  }),
  items: z.array(itemPedidoSchema).nonempty({ message: "Debe haber al menos un item" }),
  moneda: z.string().nonempty({ message: "Moneda es obligatoria" }),
  calle: z.string(),
  altura: z.string(),
  departamento: z.string().optional(),
  piso: z.string().optional(),
  codigoPostal: z.string(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const idSchema = z.string().refine((id) => mongoose.isValidObjectId(id), {
  message: "Id no valido",
});

const cancelarPedidoSchema = z.object({
  motivo: z.string().nonempty({ message: "Motivo es obligatorio" }),
});
