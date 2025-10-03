import UsuarioModel from "../schemas/UsuarioModel.js";

export class UsuarioRepository {
  async findById(id) {
    return await UsuarioModel.findById(id)
  }

  async findByEmail(email) {
    return await UsuarioModel.findOne({email})
  }
}