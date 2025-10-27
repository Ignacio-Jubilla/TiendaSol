import { NotificacionOutputDTO } from "../models/entities/dtos/output/NotificacionOutputDTO.js";
import { Notificacion } from "../models/entities/Notificacion.js";
import { NotificacionNotFoundError, NotificacionUsuarioMissmatchError } from "../errors/NotificacionesErrors.js";
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";

export class NotificacionService {
    constructor(notificacionesRepository, usuariosRepository){
        this.notificacionesRepository = notificacionesRepository
        this.usuariosRepository = usuariosRepository
    }

    //Buscar usuario para responder si no es valido/no existe
    //Paginar las notificaciones
    async obtenerNotificaciones(idUsuario, leidas, pagina, limite){
        const usuario = await this.usuariosRepository.findById(idUsuario)
        
        if(!usuario){
            throw new UsuarioNotExists()
        }

        const numeroPagina = Math.max(Number(pagina), 1);
        const elementosPagina = Math.min(Math.max(Number(limite), 1), 30);

        const notificaciones = await this.notificacionesRepository.findByPagina(idUsuario, leidas, numeroPagina, elementosPagina)

        const totalNotificaciones = await this.notificacionesRepository.contarNotificacionesDeUnUsuario(idUsuario, leidas);
        const totalPaginas = Math.ceil(totalNotificaciones / elementosPagina)

        return new NotificacionOutputDTO(numeroPagina, elementosPagina, totalNotificaciones, totalPaginas, notificaciones)
        //return notificaciones.map(n => new NotificacionOutputDTO(n))
    }

    
    async marcarNotificacionLeida(idNotificacion, idUsuario){
        const usuario = await this.usuariosRepository.findById(idUsuario)

        if(!usuario){
            throw new UsuarioNotExists()
        }

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