
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
        return pedido;
    }

    async findByUserId(usuarioId){
        const pedidos = await this.PedidoModel.find({comprador: usuarioId})
                                              .sort({fechaCreacion:-1}); // del mas reciente para atrás
        return pedidos
    }

    async update(pedido) {
        return await this.PedidoModel.findByIdAndUpdate(pedido.id, pedido, { new: true });
    }

}