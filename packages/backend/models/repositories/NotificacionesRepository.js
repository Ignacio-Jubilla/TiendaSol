import { NotificacionModel } from "../schemas/NotificacionSchema.js";

export class NotificacionesRepository {
    
    constructor(){
        this.model = NotificacionModel;
    }

    async findById(id){
        return await this.model.findById(id);
    }

    
    async findAllByUsuarioAndLeido(usuario, fueLeida){
        return await this.model.find({ usuarioDestino: usuario.id, leida: fueLeida })
        //return await this.model.find().populate('usuarioDestino');
    }
    

    async save(notificacion){
        return await this.model.save(notificacion);
    }

    async update(notificacion){        
        return await this.model.updateOne(
            { _id : notificacion.id }
        )
    }

}
