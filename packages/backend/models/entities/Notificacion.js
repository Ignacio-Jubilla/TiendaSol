
import { v4 as uuidv4 } from 'uuid';


export default class Notificacion{

    constructor(usuarioDestino,mensaje,fechaAlta){
        this.id=uuidv4();
        this.usuarioDestino = usuarioDestino;
        this.mensaje = mensaje;
        this.fechaAlta = fechaAlta;
        this.leida = false;
        this.fechaLeida;
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaLeida= new Date();
    }
}
