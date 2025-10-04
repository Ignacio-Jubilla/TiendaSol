import { CustomError } from "./CustomError";

export class UsuarioNotExists extends CustomError {
    constructor(message) {
        super(message || "Usuario no encontrado", 404);
    }
}