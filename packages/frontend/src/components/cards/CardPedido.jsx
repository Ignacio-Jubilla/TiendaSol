import React from 'react';
import { Button, Card } from "react-bootstrap";
import './CardPedido.css';
import { useNavigate } from 'react-router';

const CardPedido = ({ pedido, onPedidoCancelado, children }) => {

    const navegar = useNavigate();

    const handleCancelar = () => {
        if (onPedidoCancelado) onPedidoCancelado(pedido._id);
    }
  return (
    <section className="card card-shadow-sm p-3 d-flex flex-column bg-dark-hover" key={pedido._id}>
      <div className="pedido-header d-flex justify-content-between align-items-center mb-2">
        <h5>Pedido #{pedido._id}</h5>
        <span>
          {children}
        </span>
      </div>
      <p><strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${pedido.total}</p>

      <div className="pedido-items mb-2">
        {pedido.items.map(item => (
          <div key={item.productoId} className="pedido-item d-flex justify-content-between">
            <span>Producto {item.productoId} x {item.cantidad}</span>
            <span>${item.precioUnitario}</span>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={()=> navegar(`/pedidos/${pedido._id}`)}>Ver detalle</Button>

        {["PENDIENTE", "CONFIRMADO", "PREPARACION"].includes(pedido.estado) && (
        <Button 
        variant="danger" 
        onClick={handleCancelar}>
            Cancelar
        </Button>
        )}
      </div>
    </section>
  )
}

export default CardPedido;
