import z from "zod";

export class ItemPedidoController {
    constructor(itemPedidoService) {
        this.itemPedidoService = itemPedidoService;
    }


    async getItemPedido(req, res) {
        try {
            const { id } = req.params;
            const itemPedido = await this.itemPedidoService.getItemPedidoById(id);
            return res.status(200).json(itemPedido);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message || 'Error interno del servidor' });
        }
    }

    async getItemsPorVendedorId(req,res) {
        try{
            const {page = 1, limit = 10} =req.query;
            const query = req.query;

            const parsedQuery = getItemsPedidoByVendedor.safeParse(query);

            if(parsedQuery.error){
                return res.status(400).json(parseItemPedidoId.error.issues);
            }
            const itemProductos = await this.itemPedidoService.getItemPedidosByVendedorId(parsedQuery.data);
            res.status(200).json(itemProductos);
        }catch(error){
            res.status(error.statusCode || 500).json('Error interno del servidor');
        }
    }

    async actualizarEstadoItemPedido(req, res) {
            const { id } = req.params;
            const { estado } = req.query;
            const usuario = req.user;
        
            let itemPedidoId = id;
            console.log("Actualizar estado item pedido controller:");

            let itemPedidoActualizado;
            if(estado == 'ENVIADO'){
                itemPedidoActualizado = await this.itemPedidoService.marcarEnviado(itemPedidoId, usuario);
            } else if (estado == 'CANCELADO'){
                itemPedidoActualizado = await this.itemPedidoService.cancelarItemPedido(itemPedidoId, usuario);
            } else if(estado == "CONFIRMADO"){
                itemPedidoActualizado = await this.itemPedidoService.confirmarItemPedido(itemPedidoId, usuario.id);
            }
            
            return res.json(itemPedidoActualizado);
    }
}

const itemPedidoIdSchemaZod = z.object({
    _id: z.string().nonempty()
});

const vendedorIdSchemaZod = z.object({
    _id: z.string().nonempty()
});


const getItemsPedidoByVendedor = z.object({
    vendedorId: z.string().nonempty(),
    page: z.coerce.number().nonnegative().optional().default(1),
    perPage: z.coerce.number().nonnegative().optional().default(10)
    .transform((val) => (val > 30 ? 30 : val))
});