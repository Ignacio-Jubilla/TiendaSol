import { NotificacionModel } from "../schemas/NotificacionSchema.js";

export class NotificacionesRepository {
    
    constructor(){
        this.model = NotificacionModel;
    }

    async findByIdAndLeida(id, fueLeida){
        return await this.model.findOne({_id: id, leida: fueLeida});
    }

    
    async findAllByUsuarioAndLeida(usuario, fueLeida){
        return await this.model.find({ usuarioDestino: usuario, leida: fueLeida })
    }
    

    async save(notificacion){
        return await this.model.save(notificacion);
    }

    async update(notificacionActualizada){
        const { _id, ...notificacion } = notificacionActualizada    
            
        return await this.model.findByIdAndUpdate(
            { _id },
            { $set: notificacion },
            { new: true }
        )
    }

}
