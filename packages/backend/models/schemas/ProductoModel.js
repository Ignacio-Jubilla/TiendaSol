import mongoose from "mongoose";
import {Producto} from './../entities/Producto.js'
import {TipoMoneda} from '../entities/enums/TipoMoneda.js'
import CategoriaModel from "./CategoriaModel.js";

const productoSchema = new mongoose.Schema({
nombre: String,
vendedor: {
  type: mongoose.Schema.ObjectId,
  ref: 'Usuario'
},
titulo: String ,
descripcion : String,
categorias: {
  type:[CategoriaModel.schema]
},
precio: Number,
moneda: {
  type: String,
  enum: Object.values(TipoMoneda)
},
stock: Number,
fotos: [String],
activo: Boolean
});
productoSchema.loadClass(Producto);

const ProductoModel = mongoose.model('Producto', productoSchema);
export default ProductoModel