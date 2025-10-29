import { CustomError } from "./CustomError.js";

export class NoTokenError extends CustomError {
  constructor(message) {
    super(message || "El parametro usuario es obligatorio", 400);
  }
}

export class InvalidLoginCredentials extends CustomError {
  constructor(message) {
    super(message || "Credenciales inválidas", 401);
  }
}