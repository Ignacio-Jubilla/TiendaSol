import mongoose from "mongoose";
import ItemPedidoModel from "../schemas/ItemPedidoModel.js";

export class ItemPedidoRepository {

    async save(itemPedido) {
        const itemPedidoModel = new ItemPedidoModel(itemPedido);
        console.log(itemPedidoModel)
        return await itemPedidoModel.save();
    }

    async updateEstado(itemId, nuevoEstado) {
        return await ItemPedidoModel.findByIdAndUpdate(itemId, { estado: nuevoEstado }, { new: true })
            .populate({
                path: 'idPedido',
                select: '_id comprador items'
            })
            .populate({
                path: 'producto'
            });
    }

    async findById(id) {
        return await ItemPedidoModel.findById(id)
            .populate({
                path:'producto',
                select: 'titulo'
            })
            .populate({
                path: 'idPedido',
                select: 'direccionEntrega fechaCreacion comprador _id',
            });
    }

    async findByVendedorId(vendedorId, page = 1, perPage = 10) {
        const query = { vendedorId: new mongoose.Types.ObjectId(vendedorId) };
        
        const totalItems = await ItemPedidoModel.countDocuments(query);

        const total_pages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        
        const itemPedidos = await ItemPedidoModel.find(query)
            .skip(skip)
            .limit(perPage)
            .sort({_id: -1})
            .populate({
            path: 'producto',
            select: 'titulo'
        })

        
        return itemPedidos;
        /*
        return {
            data: itemPedidos,
            pagination: {
                page,
                total_pages
            }
        }
            */
    }

    async contarTodos(vendedorId) {
        const query = { vendedorId: new mongoose.Types.ObjectId(vendedorId) };
        return ItemPedidoModel.countDocuments(query);
    }

}