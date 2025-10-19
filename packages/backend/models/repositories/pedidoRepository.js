import PedidoModel from "../schemas/pedidoSchema.js";
import { NoPedidosYet } from "../../errors/PedidosErrors.js";

export class PedidoRepository {
    
    async findByPage(numeroPagina,elemPorPagina,filtros){
        const offset = (numeroPagina-1) *elemPorPagina;
        const pedidos = await this.findAll(filtros);
        return pedidos.slice(offset,offset+elemPorPagina);
    }

    async findAll(filtros) {       
        
        const query = {};
        if(filtros.maxPrice){
            query.total = { $lte: filtros.maxPrice };
        }
        if(filtros.estado){
            query.estado = filtros.estado;
        }
        if(filtros.usuarioId){
            query.comprador = filtros.usuarioId;
        }

        const pedidos = await PedidoModel.find(query);

        if(!pedidos || pedidos.length === 0){
            throw new NoPedidosYet();
        }
        return pedidos;
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

    async contarTodos() {
    const pedidos = await this.findAll({});
    return pedidos.length;
  }
}