//export const PedidosRouter = require('express').Router()// ojo con importar con distintos metodos
//                                                      no se puede mezclar import y require
import { DireccionEntregaBuilder } from '../models/entities/DireccionEntrega.js';
import { PedidoDTO } from '../models/entities/dtos/input/PedidoDTO.js';
import express from 'express';
const direccionEntregaBuilder = new DireccionEntregaBuilder();

export class PedidosController {
  // constructor(pedidoService) {
  //   this.pedidoService = pedidoService;
  // }

  crearPedido = (req, res) => {
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

    if (!body.compradorId || !body.items || !body.moneda) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const pedidoDTO = new PedidoDTO(body.compradorId, body.items, body.moneda, direccionEntrega)
    //pedidoService.crearPedido(pedidoDTO)
    res.status(201).json("Pedido creado")
  }

  marcarEnviado = (req, res) => {
    // const pedidoId = req.params.id
    // if (!pedidoId) {
    //   return res.status(400).json({ error: 'Falta id de pedido' });
    // }
    // pedidoService.marcarEnviado(pedidoId)
    res.status(200).json("En construccion")
  }

  cancelarPedido = (req, res) => {
    // const pedidoId = req.params.id
    // const { motivo } = req.body
    // if (!pedidoId) {
    //   return res.status(400).json({ error: 'Falta id de pedido' });
    // }
    // pedidoService.cancelarPedido(pedidoId, motivo);
    res.status(200).json("En construccion")
  }
}

