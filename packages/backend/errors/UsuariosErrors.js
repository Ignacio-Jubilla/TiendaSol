import { CustomError } from "./CustomError.js";

export class UsuarioNotExists extends CustomError {
    constructor(message) {
        super(message || "Usuario no encontrado", 404);
    }
}