
export class PedidoRepository {
    constructor({ PedidoModel }) {
        this.PedidoModel = PedidoModel;
    }

    async findAll() {       
        return await this.PedidoModel.find()
    }
    
    async save(pedido) {
        const pedidoModel = new this.PedidoModel(pedido);
        return await pedidoModel.save();
    }

    async findById(id) {
        const pedido = await this.PedidoModel.findById(id);
        if (!pedido) {
            throw new Error('Pedido no encontrado');
        }
        return pedido;
    }

    async findByUserId(usuarioId){
        const pedidos = await this.PedidoModel.find({comprador: usuarioId})
                                              .sort({fechaCreacion:-1}); // del mas reciente para atrás
        if(pedidos.length === 0){
            throw new Error('no se encontraron pedidos')
        }
        return pedidos
    }

}