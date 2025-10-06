import { NotificacionOutputDTO } from "../models/entities/dtos/output/NotificacionOutputDTO.js";
import { Notificacion } from "../models/entities/Notificacion.js";
import { FactoryNotificacion } from "../models/entities/FactoryNotificacion.js";
import { NotificacionNotFoundError, NotificacionUsuarioMissmatchError } from "../errors/NotificacionesErrors.js";

export class NotificacionService {
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository
        //this.factoryNotificacion = factoryNotificacion
    }

    /*
    async crearNotificacion(pedido){
        const notificacion = new Notificacion(factoryNotificacion.crearSegunPedido(pedido))
        await this.notificacionesRepository.save(pedido)
    }*/

    async obtenerNotificaciones(idUsuario, leidas){
        const notificaciones = await this.notificacionesRepository.findAllByUsuarioAndLeida(idUsuario, leidas)

        return notificaciones.map(n => new NotificacionOutputDTO(n))
    }

    
    async marcarNotificacionLeida(idNotificacion, idUsuario){
        const notificacion = await this.notificacionesRepository.findByIdAndLeida(idNotificacion, false);
        if(!notificacion){
            throw new NotificacionNotFoundError("Notificacion no encontrada")
        }

        if(notificacion.usuarioDestino != idUsuario){
            throw new NotificacionUsuarioMissmatchError("El usuario no corresponde a la notificacion")
        }

        notificacion.marcarComoLeida()
        const notificacionLeida = await this.notificacionesRepository.update(notificacion);

        return new NotificacionOutputDTO(notificacionLeida)
    }

}