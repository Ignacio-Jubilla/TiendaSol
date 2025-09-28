import { z } from 'zod'
import { ProductoService } from '../services/ProductoService.js';
import { InputValidationError } from '../errors/ProductosErrors.js';
import { TipoMoneda } from '../models/entities/enums/TipoMoneda.js';
import expressAsyncHandler from 'express-async-handler';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepotisory.js';
import mongoose from 'mongoose';

export class ProductosController {
  constructor(productoService) {
    this.productoService = productoService
  }
  async obtenerProductoId(req, res) {
    const idProducto = req.params.id
    if (!mongoose.isValidObjectId(idProducto)) throw new InputValidationError("Id de producto no valido")
    const producto = await this.productoService.obtenerProducto(idProducto)
    return res.status(200).json(producto)
  }

  async obtenerProductos(req, res) {
    const query = req.query
    const parsedQuery = buscarProductoSchema.safeParse(query)
    if (parsedQuery.error) {
      return res.status(400).json(parsedQuery.error.issues)
    }
    const productos = await this.productoService.obtenerProductos(parsedQuery.data)
    return res.status(200).json(productos)
  }

  async crearProducto(req, res) {
    const body = req.body;
    const parsedBody = productoSchema.safeParse(body);
    if (parsedBody.error) {
      return res.status(400).json(parsedBody.error.issues);
    }

    const productoNuevo = await this.productoService.crearProducto(parsedBody.data)
    return res.status(201).json(productoNuevo)
  }
}

const productoSchema = z.object({
  vendedorId: z.string().nonempty(),
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  categorias: z.array(z.string().min(3)).nonempty("Debe haber al menos una categoría"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  moneda: z.enum(Object.values(TipoMoneda)),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  fotos: z.array(z.string()).optional(),
});

const buscarProductoSchema = z.object({
  vendedorId: z.string("No se recibio un id de usuario").nonempty(),
  valorBusqueda: z.string().optional(),
  precioMin: z.coerce.number().nonnegative().optional(),
  precioMax: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().nonnegative().optional().default(1),
  perPage: z.coerce.number().nonnegative().optional().default(30)
    .transform((val) => (val > 30 ? 30 : val)),
  ordenarPor: z.enum(["PRECIO", "VENTAS"]).optional(),
  tipoMoneda: z.enum(Object.values(TipoMoneda), "Ingrese un tipo de moneda valido").optional().default('DOLAR_USA'),
  ordenPrecio: z.enum(["ASC", "DESC"]).optional().default("DESC"),
}).superRefine((data, ctx) => {
  if ((data.precioMin || data.precioMax) && !data.tipoMoneda) {
    ctx.addIssue({
      code: "custom",
      path: ["tipoMoneda"],
      message: "tipoMoneda es obligatorio cuando ordenarPor = PRECIO",
    });
  }
  if (data.precioMin && data.precioMax && data.precioMin >= data.precioMax) {
    ctx.addIssue({
      code: "custom",
      path: ["precioMin"],
      message: "precioMin debe ser menor a precioMax",
    });
  }
});