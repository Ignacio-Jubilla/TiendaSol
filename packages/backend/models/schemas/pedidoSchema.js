import mongoose from "mongoose";
import Pedido from "../models/Pedido.js";
import { v4 as uuidv4 } from 'uuid';
import DireccionEntregaSchema from "./direccionEntrega.js";
import CambioEstadoPedidoSchema from "./cambioEstadoPedido.js";
import ItemSchema from "./item.js";
import { EstadoPedido } from "../models/EstadoPedido.js";

const pedidoSchema = new mongoose.Schema({
  comprador: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario',
    required: true },
  items: [ItemSchema],
  total: { type: Number, required: true },
  moneda: { type: String, required: true },
  direccionEntrega: DireccionEntregaSchema,
  estado: { type: String, enum: Object.values(EstadoPedido), default: EstadoPedido.PENDIENTE },
  fechaCreacion: { type: Date, default: Date.now },
  historialEstados: [CambioEstadoPedidoSchema]
},{
    timestamps: true,
    collection: 'pedidos'
});

pedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model('Pedido', pedidoSchema);