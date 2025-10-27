import React, { useState } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import carritoMock from '../../mocks/carrito.json'

const Carrito = () => {
  const navegar = useNavigate();
  const [items, setItems] = useState(carritoMock);

  const vaciarCarrito = () => setItems([]);
  const totalCarrito = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      
      <div style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
        <Button variant="outline-secondary" onClick={() => navegar(-1)}>
          &larr; Volver
        </Button>
      </div>

      <Card style={{ maxWidth: '700px', width: '100%' }} className="p-4 shadow-sm">
        <Card.Title className="mb-3">Tu Carrito</Card.Title>

        {items.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.productoId}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precioUnitario}</td>
                    <td>${item.precioUnitario * item.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5>Total: ${totalCarrito}</h5>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="danger" className="me-2" onClick={vaciarCarrito}>
                Vaciar carrito
              </Button>
              <Button variant="success" onClick={() => alert("Aquí se generaría el pedido")}>
                Proceder a comprar
              </Button>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Carrito;
