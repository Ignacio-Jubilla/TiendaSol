import { NotificacionOutputDTO } from "../models/entities/dtos/output/NotificacionOutputDTO.js";
import { Notificacion } from "../models/entities/Notificacion.js";

export class NotificacionService {
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository
    }


    async obtenerNotificaciones(idUsuario, leidas){
        notificaciones = await this.notificacionesRepository.findAllByUsuarioAndLeido(idUsuario, leidas)

        return notificaciones.map(n => new NotificacionOutputDTO(n))
    }

    
    async marcarNotificacionComoLeida(idNotificacion, idUsuario){
        const notificacion = this.notificacionesRepository.findById(idNotificacion);
        if(!notificacion){
            throw new NotFoundError("Notificacion no encontrada")
        }

        if(notificacion.usuarioDestino != idUsuario){
            throw new NotificacionError("Notificacion invalida")
        }

        notificacion.leida = true;
        const notificacionLeida = await this.notificacionesRepository.update(notificacion);

        return NotificacionOutputDTO(notificacionLeida)
    }

}