class NotificacionRepo {
constructor() {
    this.notificaciones = []
  }

  update = (id, nuevoNot) => {
    this.notificaciones= this.notificaciones.map(p => p.id === id ? nuevoNot: p)
  }

  findById = (id) => {
    this.notificaciones.find(p => p.id === id)
  }
}