import { z } from 'zod'
import { ProductoService } from '../services/ProductoService.js';
import { InputValidationError } from '../errors/ProductosErrors.js';
import { TipoMoneda } from '../models/entities/enums/TipoMoneda.js';
import expressAsyncHandler from 'express-async-handler';
import { ProductoRepository } from '../models/repositories/ProductosRepository.js';
import { CategoriaRepository } from '../models/repositories/CategoriaRepository.js';
import { UsuarioRepository } from '../models/repositories/UsuariosRepotisory.js';

export class ProductosController {
  constructor(productoService) {
    this.productoService = productoService
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
  vendedorId: z.string().nonempty("No se recibio un id de usuario"),
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  categorias: z.array(z.string().min(3)).nonempty("Debe haber al menos una categoría"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  moneda: z.enum(Object.values(TipoMoneda)),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  fotos: z.array(z.string()).optional(),
});

const buscarProductoSchema = z.object({
  vendedorId: z.string().nonempty("No se recibio un id de usuario"),
  valorBusqueda: z.string().optional(),
  precioMin: z.coerce.number().nonnegative().optional(),
  precioMax: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().nonnegative().optional().default(1),
  perPage: z.coerce.number().nonnegative().optional().default(30)
  .transform((val) => (val > 30 ? 30 : val)),
  ordenarPor: z.enum(["PRECIO", "VENTAS"]).optional(),
  ordenPrecio: z.enum(["ASC", "DESC"]).optional().default("DESC"),
}).refine(
  (data) => {
    if (data.precioMin && data.precioMax) {
      return data.precioMin < data.precioMax;
    }
    return true; // si falta alguno, no se valida
  },
  {
    message: "precioMin debe ser menor a precioMax",
    path: ["precioMin"], 
  }
);