class UsuarioRepo{
  constructor() {
    this.usuarios = []
  }

  update = (id, nuevoUsuario) => {
    this.usuarios = this.usuarios.map(p => p.id === id ? nuevoUsuario: p)
  }

  findById = (id) => this.usuarios.find(p => p.id === id)
}