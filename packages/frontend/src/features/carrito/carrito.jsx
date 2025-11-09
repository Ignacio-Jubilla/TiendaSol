import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import carritoMock from '../../mocks/carrito.json'
import { useCart } from '../../context/CartContext';
import { ConversorMonedas } from '../../services/conversorMonedas';
import { obtenerTipoCambio } from '../../services/exchangeApiExternal';
import tiposCambioManual from '../../services/tiposCambioManual';

const Carrito =  () => {
  const navegar = useNavigate();

  const [items, setItems] = useState(carritoMock);
  const {cartItems, totalValueCart, cleanCart, removeItem} = useCart()
  const totalCarrito = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
  const handleRemoveItem = (productoId) => {
    removeItem(productoId);
  };
  const conversorMoneda = new ConversorMonedas(obtenerTipoCambio() || tiposCambioManual)
  const obtenerSumaPrecioEn = (moneda, items) => {
    const precios = items.map(item => 
      conversorMoneda.convertir(item.moneda, moneda, item.precioUnitario) * item.cantidad)
    return Number.parseFloat(precios.reduce((acc, precio) => acc + precio, 0)).toFixed(2)
  }

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      
      <div style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
        <Button variant="outline-secondary" onClick={() => navegar(-1)}>
          &larr; Volver
        </Button>
      </div>

      <Card style={{ maxWidth: '700px', width: '100%' }} className="p-4 shadow-sm">
        <Card.Title className="mb-3">Tu Carrito</Card.Title>

        {!cartItems ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Moneda</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.productoId}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precioUnitario}</td>
                    <td>{item.moneda == "DOLAR_USA" ? 'U$D' : item.moneda == "PESO_ARG" ? 'AR$' : "BRL"}</td>
                    <td>${Number.parseFloat(item.precioUnitario * item.cantidad).toFixed(2)}</td>
                    <td><button className="btn btn-danger" onClick={() => handleRemoveItem(item.productoId)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5>Total: </h5>

            <h5>U$D {
              obtenerSumaPrecioEn("DOLAR_USA", cartItems)
              }</h5>

              <h5>ARS {
              obtenerSumaPrecioEn("PESO_ARG", cartItems)
              }</h5>    
              <h5>BRL {
              obtenerSumaPrecioEn("REAL", cartItems)
              }</h5>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="danger" className="me-2" onClick={()=> cleanCart()}>
                Vaciar carrito
              </Button>
              <Button variant="success" disabled={
                (!cartItems || cartItems.length === 0)
              }
              as={Link}
              to="/finalizar-compra"
              >
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
