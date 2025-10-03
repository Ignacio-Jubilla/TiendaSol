import { CustomError } from "./CustomError";

export class PedidoNotFound extends CustomError {
  constructor() {
   super(404, "Pedido no encontrado");
  }
}


