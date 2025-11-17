import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import './CardPedido.css';
import { useNavigate } from 'react-router';
import productosService from '../../services/productos.js'; // import default

const CardPedido = ({ pedido, onPedidoCancelado, children, ShowDetalleBtn = true, showItems = true }) => {
  const navegar = useNavigate();
  const [productosNombres, setProductosNombres] = useState({}); // {id: nombre}

  const handleCancelar = () => {
    if (onPedidoCancelado) onPedidoCancelado(pedido._id);
  }

useEffect(() => {
  if(!showItems) return;

  const fetchNombres = async () => {
    const nombres = {}; // objeto local, nuevo por cada render
    await Promise.all(
      pedido.items.map(async (item, index) => {
        const pid = item.productoId || item.producto?._id || `item-${index}`;

        try {
          const producto = item.producto || await productosService.getProducto(item.productoId);
          nombres[pid] = producto?.titulo || 'Nombre desconocido';
        } catch {
          nombres[pid] = '-Producto desconocido';
        }
      })
    );
    setProductosNombres(nombres);
  };

  if (pedido.items?.length > 0) fetchNombres();
}, [pedido.items,showItems]);


  return (
    <section className="card-pedido" key={pedido._id}>
      <div className="pedido-header d-flex justify-content-between align-items-center">
        <span className="pedido-id">Pedido #{pedido._id}</span>
        <span className="badge-modern">{children}</span>
      </div>

      <p><strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
      <p className="pedido-total">Total: ${pedido.total}</p>

      {showItems && (
      <div className="pedido-items">
        {pedido.items.map((item, index) => {
          const pid = item.productoId || item.producto?._id || `item-${index}`;
          return (
            <div key={pid} className="pedido-item">
              <span>{productosNombres[pid] || 'Cargando...'} x {item.cantidad}</span>
              <span>${(item.cantidad * item.precioUnitario).toFixed(2)}</span>
            </div>
          )
        })}
      </div>
      )}

      <div className="d-flex gap-2 justify-content-end">
        {ShowDetalleBtn && (<Button 
          className="btn-modern btn-modern-primary"
          onClick={()=> navegar(`/pedidos/${pedido._id}`)}
        >
          Ver detalle
        </Button>
        )}

        {["PENDIENTE", "CONFIRMADO", "EN_PREPARACION"].includes(pedido.estado) && (
          <Button 
            className="btn-modern btn-modern-danger"
            onClick={handleCancelar}
          >
            Cancelar
          </Button>
        )}
      </div>
    </section>
  )
}

export default CardPedido;