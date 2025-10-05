import { CustomError } from "../errors/CustomError.js";
import { EntidadNotFoundError } from "../errors/ProductosErrors.js";
import logger from './logger.js'
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err , req, res, next) => {
  if (err instanceof CustomError) {
    const statusCode = parseInt(err.statusCode, 10) || 400;
    return res.status(statusCode).json({
      success: false,
      type: "CustomError",
      message: err.message,
    });
  }
  // errores de mongodb
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      type: "ValidationError",
      message: "Datos inválidos en la solicitud",
      details: err.errors,
    });
  }

  // Errores de casteo (ej: ObjectId malformado)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      type: "CastError",
      message: `Valor inválido para campo`,
    });
  }

  // Error por duplicados (índice unique)
  if (err.code === 11000 || err.message.includes('E11000 duplicate key error')) {
    return res.status(409).json({
      success: false,
      type: "DuplicateKey",
      message: "El recurso ya existe con ese valor único",
    });
  }

  // Error de conexión con MongoDB
  if (err.name === "MongooseServerSelectionError") {
    return res.status(503).json({
      success: false,
      type: "DatabaseConnectionError",
      message: "No se pudo conectar a la base de datos",
    });
  }

  // Error genérico
  res.status(500).json({
    message: "Error inesperado",
  })

  next(err)
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

export default{
  requestLogger,
  unknownEndpoint,
  errorHandler
}