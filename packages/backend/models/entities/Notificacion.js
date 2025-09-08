import { v4 as uuidv4 } from 'uuid';


export class Notificacion{

    constructor(usuarioDestino,mensaje){
        this.id=uuidv4();
        this.usuarioDestino = usuarioDestino;
        this.mensaje = mensaje;
        this.fechaAlta = new Date().toLocaleString();
        this.leida = false;
        this.fechaLeida;
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaLeida= new Date();
    }
}
