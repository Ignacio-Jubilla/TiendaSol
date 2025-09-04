export default class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepo()
  }

  findById = (id) => this.usuarioRepository.findById(id)
}