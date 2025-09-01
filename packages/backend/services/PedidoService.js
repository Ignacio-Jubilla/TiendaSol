import { DireccionEntregaBuilder } from "../models/entities/DireccionEntrega";
import { EstadoPedido } from "../models/entities/enums/EstadoPedido";
import { obtenerMoneda, TipoMoneda } from "../models/entities/enums/TipoMoneda";
import Pedido from "../models/entities/Pedido";

export default class PedidoService {
  constructor(productoService, usuarioService, notificacionService) {
    this.pedidosRepository = new PedidoRepo()
    this.productoService = productoService
    this.usuarioService = usuarioService
    this.notificacionService = notificacionService
  }
  
  crearPedido = (pedidoDTO) => {
    let pedido = new Pedido()
    let comprador = usuarioService.findById(pedidoDTO.getCompradorId())
    pedido.setComprador(comprador)
    pedido.setMoneda(obtenerMoneda(pedidoDTO.getMoneda()))
    
    pedidoDTO.getItems().forEach(item => {
      let producto = productoService.findById(item.getProductoId())
      pedido.agregarItem(new ItemPedido(producto, item.getCantidad()))
    });

    pedido.setDireccionEntrega(pedidoDTO.getDireccionEntrega())

    this.pedidosRepository.save(pedido)
    //TODO 
    //Enviar notificaciones a vendedores de los productos pedidoa
  }

  cancelarPedido = (id, motivo) => {
    let pedido = this.pedidosRepository.findById(id)
    
    pedido.actualizarEstado(EstadoPedido.CANCELADO, pedido.comprador, motivo)
    this.pedidosRepository.update(id, pedido)
    //TODO
    //Enviar notificaciones a vendedores
  }

  marcarEnviado = (id, idVendedor) => {
    let pedido = this.pedidosRepository.findById(id)
    let vendedor = this.usuarioService.findById(idVendedor)
    pedido.actualizarEstado(EstadoPedido.ENVIADO, vendedor, "Vendedor marco pedido como enviado")
    this.pedidosRepository.update(id, pedido)
    //TODO
    //Enviar notificacion a comprador de producto
  }
}