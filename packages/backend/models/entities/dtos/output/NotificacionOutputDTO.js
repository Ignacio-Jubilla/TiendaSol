export class NotificacionOutputDTO{
    constructor(notificacion){
        this.id = notificacion._id,
        this.usuarioDestino = notificacion.usuarioDestino,
        this.mensaje = notificacion.mensaje,
        this.fechaAlta = notificacion.fechaAlta,
        this.leida = notificacion.leida,
        this.fechaLeida = notificacion.fechaLeida
    }
}