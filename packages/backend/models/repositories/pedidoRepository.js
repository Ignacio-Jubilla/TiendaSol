import PedidoModel from "../schemas/pedidoSchema.js";

export class PedidoRepository {
    
    async findAll() {       
        return await PedidoModel.find()
    }
    
    async save(pedido) {
        const pedidoModel = new PedidoModel(pedido);
        return await pedidoModel.save();
    }

    async findById(id) {
        const pedido = await PedidoModel.findById(id);
        return pedido;
    }

    async findByUserId(usuarioId){
        const pedidos = await PedidoModel.find({comprador: usuarioId})
                                              .sort({fechaCreacion:-1}); // del mas reciente para atrás
        return pedidos
    }

    async update(pedido) {
        return await PedidoModel.findByIdAndUpdate(pedido.id, pedido, { new: true });
    }

}