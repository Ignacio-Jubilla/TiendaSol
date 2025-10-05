import { CustomError } from "./CustomError.js";

export class PedidoNotFound extends CustomError {
  constructor(message) {
   super(message || "Pedido no encontrado", 404);
  }
}

export class NotEnoughStockError extends CustomError {
  constructor(message) {
    super(message || "No hay suficiente stock", 400);
  }
}

export class EntidadNotFoundError extends CustomError {
  constructor(message) {
    super(message || "Entidad no encontrada", 404);
  } 
}

export class CancelationError extends CustomError {
  constructor(message) {
    super(message || "Error en la cancelación del pedido", 400);
  }
}
