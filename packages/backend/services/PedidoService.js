import { PedidoNotFound } from "../errors/PedidosErrors.js";
import { UsuarioNotExists } from "../errors/UsuariosErrors.js";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido.js";
import { Pedido } from "../models/entities/Pedido.js";
import { PedidoOutputDTO } from "../models/entities/dtos/output/PedidoOutputDTO.js";
import { CancelationError, EntidadNotFoundError, NoPuedeEnviarseError } from "../errors/PedidosErrors.js";
import mongoose from "mongoose";
import { es } from "zod/v4/locales";


export class PedidoService {
    constructor(PedidoRepository, ItemPedidoRepository, UsuariosRepository, ProductosRepository, NotificacionService) {
        this.pedidoRepository = PedidoRepository
        this.itemPedidoRepository = ItemPedidoRepository
        this.usuariosRepository = UsuariosRepository
        this.productosRepository = ProductosRepository
        this.notificacionService = NotificacionService
    }
    async obtenerPedidosPaginados(page, limit, filtros) {
        const numeroPagina = Math.max(Number(page), 1);
        const elemPorPagina = Math.min(Math.max(Number(limit), 1), 100)// entre 1 y 100

        const pedidosPaginados = await this.pedidoRepository.findByPage(
            numeroPagina, elemPorPagina, filtros
        );
        if (!pedidosPaginados || pedidosPaginados.length === 0) {
            throw new PedidoNotFound('No se encontraron pedidos');
        }
        const total = await this.pedidoRepository.contarTodos(filtros);
        const totalPaginas = Math.ceil(total / elemPorPagina);

        return {
            pagina: numeroPagina,
            PorPagina: elemPorPagina,
            total: total,
            totalPaginas: totalPaginas,
            data: pedidosPaginados
        }

    }

    obtenerPedidoPorId = async (pedidoId) => {
        const pedido = await this.pedidoRepository.findById(pedidoId);
        if (!pedido) {
            throw new PedidoNotFound(`Pedido con id ${pedidoId} no encontrado`);
        }
        return this.toOutputDTO(pedido);
    }

    async crearPedido(pedidoInputDTO) {

        const usuario = await this.usuariosRepository.findById(pedidoInputDTO.compradorId);

        if (!usuario) {
            throw new UsuarioNotExists('El usuario comprador no existe')
        }
        let total = 0;
        for (const item of pedidoInputDTO.items) {
            const producto = await this.productosRepository.findById(item.productoId);
            if (!producto) {
                throw new EntidadNotFoundError("producto con id " + item.productoId + " no encontrado");
            }
            producto.estaDisponible(item.cantidad);
            total += producto.precio * item.cantidad;
        }

        const pedidoData = this.creacionToDB({ ...pedidoInputDTO, total: total });

        const pedidoGuardado = await this.pedidoRepository.save(pedidoData);
        let listaItemsId = [];
        for (const item of pedidoInputDTO.items) {
            const producto = await this.productosRepository.findById(item.productoId);

            producto.reducirStock(item.cantidad);

            await this.productosRepository.updateProducto(
                item.productoId,
                { stock: producto.stock }
            );

            const itemPedidoData = {
                producto: item.productoId,
                cantidad: item.cantidad,
                precioUnitario: producto.precio,
                estado: EstadoPedido.PENDIENTE,
                idPedido: pedidoGuardado._id || pedidoGuardado.id,
                vendedorId: producto.vendedor
            };
            const itemPedidoGuardado = await this.itemPedidoRepository.save(itemPedidoData);

            listaItemsId.push(itemPedidoGuardado._id);
        }

        //add list of items id to pedido
        pedidoGuardado.items = listaItemsId;

        const pedidoActualizado = await this.pedidoRepository.update(pedidoGuardado._id, { items: listaItemsId });

        await this.notificacionService.crearNotificacionPedido(pedidoActualizado, usuario);

        return this.toOutputDTO(pedidoGuardado);
    }

    // tema a consultar, 
    // si conviene instanciar el pedido para poder usar sus metodos, 
    // o agregar los metodos al documento mongoose
    async cancelarPedido(pedidoId, motivo, user) {
        const lista = [EstadoPedido.CANCELADO, EstadoPedido.ENTREGADO, EstadoPedido.ENVIADO];
        const pedidoBase = await this.pedidoRepository.findById(pedidoId);
        if (!pedidoBase) {
            throw new PedidoNotFound();
        }

        const pedido = Pedido.fromDB(pedidoBase);

        if (lista.includes(pedido.estado)) {
            throw new CancelationError();
        }
        console.log('pedido: ' + pedido._id)
        const compradorId = pedido.comprador._id.toString();
        const usuarioQueCancela = await this.usuariosRepository.findById(compradorId);
        // falta notif TODO
        if (!usuarioQueCancela) {
            throw new UsuarioNotExists();
        }
        // se aumenta el stock de los productos del pedido

        const listaa = [EstadoPedido.CANCELADO, EstadoPedido.ENTREGADO, EstadoPedido.ENVIADO];
        console.log('actualizando estado de items')
        for (const item of pedidoBase.items) {
            if (listaa.includes(item.estado)) continue;
            const itemPedidoId = item._id;
            const estado = EstadoPedido.CANCELADO;
            await this.itemPedidoRepository.updateEstado(itemPedidoId, estado);
            const productoId = item.producto;
            const producto = await this.productosRepository.findById(productoId);
            if (!producto) {
                throw new EntidadNotFoundError(`Producto con id ${productoId} no encontrado`);
            }

            producto.aumentarStock(item.cantidad);

            await this.productosRepository.updateProducto(
                productoId,
                {
                    stock: producto.stock
                }
            );
            console.log('producto actualizado')
        }

        const updateData = this.modifToDB(pedido);
        //change pedido estado to cancelado and update historial and save to repo
        pedido.actualizarEstado(EstadoPedido.CANCELADO, usuarioQueCancela._id, this.modifToDB(pedido));
        
        const pedidoActualizado = await this.pedidoRepository.update(pedido._id, pedido);

        await this.notificacionService.crearNotificacionPedido(pedidoActualizado, user);

        return this.toOutputDTO(updateData);
    }

    async verificarEstado(pedidoId) {
        const pedidoBase = await this.pedidoRepository.findById(pedidoId)
        if (!pedidoBase) {
            throw new PedidoNotFound()
        }

        console.log('existe pedido')
        const pedido = Pedido.fromDB(pedidoBase);

        const listaEstados = [];
        let estadoActual

        for (const item of pedido.items) {
            const itemPedido = await this.itemPedidoRepository.findById(item._id);
            if (!itemPedido) {
                throw new EntidadNotFoundError(`ItemPedido con id ${item._id} no encontrado`);
            }

            if (listaEstados.length === 0) {
                estadoActual = itemPedido.estado
            } else {
                if (listaEstados.includes(itemPedido.estado)) {
                    estadoActual = itemPedido.estado
                } else {
                    estadoActual = EstadoPedido.PENDIENTE
                }
            }
            listaEstados.push(itemPedido.estado)
        }

        const soloCanceladoYEnviado = listaEstados.every(estado => 
            estado === EstadoPedido.CANCELADO || estado === EstadoPedido.ENVIADO
        ) && listaEstados.includes(EstadoPedido.ENVIADO);

        if (soloCanceladoYEnviado) {
            estadoActual = EstadoPedido.ENVIADO;
        }

        pedido.actualizarEstado(estadoActual, null, 'Cambio automático de estado según items del pedido');
        const pedidoFinal = await this.pedidoRepository.update(pedido._id, this.modifToDB(pedido));
        console.log(pedidoFinal)
        return pedidoFinal;
    }


    toOutputDTOs(pedidos) {
        return pedidos.map(x => this.toOutputDTO(x))
    }

    toOutputDTO(pedido) {
        return new PedidoOutputDTO(pedido);
    }

    modifToDB(pedido) {
        return {
            comprador: pedido.comprador,
            estado: pedido.estado,
            historialEstados: pedido.historialEstados.map(ce => ({
                estado: ce.estado,
                usuarioId: ce.usuarioId ? ce.usuarioId.toString() : null,
                fecha: ce.fecha,
                motivo: ce.motivo
            })),
            total: pedido.total
        };
    }

    creacionToDB(nuevoPedido) {
        return {
            comprador: nuevoPedido.compradorId,
            items: [],
            moneda: nuevoPedido.moneda,
            direccionEntrega: { ...nuevoPedido.direccionEntrega },
            estado: EstadoPedido.PENDIENTE,
            fechaCreacion: nuevoPedido.fechaCreacion,
            historialEstados: [],
            total: nuevoPedido.total
        };
    }
}