import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import './CardPedido.css';
import { useNavigate } from 'react-router';
import productosService from '../../services/productos.js'; // import default
import  pedidoService  from '../../services/pedidos.js';
import { confirmAction, showSuccess, showError } from '../../utils/confirmAction.js';

const CardPedido = ({ pedido, onPedidoCancelado, onItemCancelado, ShowDetalleBtn = true,showCancelarItemBtn = false, showItems = true, children}) => {
  const navegar = useNavigate();
  const [productosNombres, setProductosNombres] = useState({}); // {id: nombre}
  const [pedidoState, setPedido] = useState(pedido);

  const handleCancelarPedido = () => {
    if (onPedidoCancelado) onPedidoCancelado(pedidoState._id); 
  // CORRECCIÓN 1: Usar 'pedidoState' para mantener los datos actuales (incluidos los items)
  setPedido(prev => ({ ...prev, estado: "CANCELADO" }));
  }

  useEffect(() => {
  setPedido(pedido);
}, [pedido]);

const handleCancelarItem = async (itemId) => {
  try {
    const confirmacion = await confirmAction({
      title: "Cancelar item?",
      text: "¿Estás seguro que deseas cancelar este item del pedido?",
      confirmText: "Sí, cancelar",
    });
    if (!confirmacion) return;

    await pedidoService.cancelarItemPedido(pedidoState._id, itemId);

    setPedido(prev => ({
      ...prev,
      items: prev.items.map(i =>
        (i._id === itemId || i.productoId === itemId) 
          ? { ...i, estado: "CANCELADO" } 
          : i
      )
    }));

    if(onItemCancelado) onItemCancelado(itemId);
    showSuccess("Item cancelado con éxito");
  } catch (error) {
    console.error("Error al cancelar el item del pedido:", error);
  }
}

useEffect(() => {
    if (!pedidoState?.items) return;

    const todosCancelados = pedidoState.items.every(i => i.estado === "CANCELADO");

    if (todosCancelados && pedidoState.estado !== "CANCELADO") {
      setPedido(prev => ({ ...prev, estado: "CANCELADO" }));

      if (onPedidoCancelado) {
        onPedidoCancelado(pedidoState._id);
      }

      showSuccess("Todos los ítems fueron cancelados. Pedido cancelado.");
    }
  }, [pedidoState.items]);

useEffect(() => {
  if(!showItems) return;

  const fetchNombres = async () => {
    const nombres = {}; // objeto local, nuevo por cada render
    await Promise.all(
      pedidoState.items.map(async (item, index) => {
        const pid = item.producto || `item-${index}`;
        try {
          const producto = await productosService.getProducto(pid);
          nombres[pid] = producto.titulo;
        } catch {
          nombres[pid] = '-Producto desconocido';
        }
      })
    );
    setProductosNombres(nombres);
  };

  if (pedidoState.items?.length > 0) fetchNombres();
}, [pedidoState.items,showItems]);

//const pedidoCancelado = pedidoState.estado === "CANCELADO";
const todosCancelados = pedidoState.items?.every(i => i.estado === "CANCELADO");

  return (
    <section className="card-pedido" key={pedidoState._id}>
      <div className="pedido-header d-flex justify-content-between align-items-center">
        <span className="pedido-id">Pedido {pedidoState._id}</span>
        <span className="badge-modern">{children}</span>
      </div>

      <p><strong>Fecha:</strong> {new Date(pedidoState.fechaCreacion).toLocaleDateString()}</p>
      <p className="pedido-total">Total: ${pedidoState.total}</p>

      {showItems && (
      <div className="pedido-items">
        {pedidoState.items.map((item, index) => {
          const pid = item.producto || `item-${index}`;
          return (
            <div key={pid} className="pedido-item">
              <span>{productosNombres[pid] || 'Cargando...'} x {item.cantidad}</span>
              <span>${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
            {showCancelarItemBtn && pedidoState.estado!=="CANCELADO" && item.estado !== "CANCELADO" && (
              <Button 
                className="btn-modern btn-modern-danger"
                size="sm"
                onClick={() => handleCancelarItem(item._id)}
              >
                Cancelar item
              </Button>
          )}
            </div>
          )
        })}
      </div>
      )}

      <div className="d-flex gap-2 justify-content-end">
        {ShowDetalleBtn && (<Button 
          variant="primary"
          onClick={()=> navegar(`/pedidos/${pedidoState._id}`)}
        >
          Ver detalle
        </Button>
        )}

        {["PENDIENTE", "CONFIRMADO", "EN_PREPARACION"].includes(pedidoState.estado) 
        && !todosCancelados && (
          <Button 
            variant="danger"
            onClick={handleCancelarPedido}
          >
            Cancelar pedido
          </Button>
        )}
      </div>
    </section>
  )
}

export default CardPedido;