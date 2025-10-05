export class NotificacionesController {

    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    /*
        De momento pasamos el USER como query param, explicacion de eze:
        
        "Respecto al user, no va a ser necesario pasarlo por parámetro pues lo tomaremos de otra forma;
        aunque por el momento lo pueden establecer así. Luego los ayudaremos a modificarlo."
    */
    async obtenerNotificaciones(req, res){
        const { idUsuario, leidas = 'true' } = req.query;

        if(!idUsuario){
            throw new NotUserError("Usuario no encontrado")
        }
        const notificaciones = this.notificacionService.obtenerNotificaciones(idUsuario, leidas)

        res.status(200).json(notificaciones)
        return
    }

    async marcarNotificacionLeida(req, res){
        const idUsuario = req.query.usuario
        if(!idUsuario){
            throw new NotUserError("Usuario no encontrado")
        }

        const notificacion = this.notificacionService.marcarNotificacionLeida(req.params.id, idUsuario)

        res.status()

        return
    }



}