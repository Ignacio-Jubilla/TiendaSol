import React from 'react';
import { Link, useParams } from 'react-router';
import productosMocked from '../../mocks/productos.json';
import { Button, Carousel, Container, Form } from 'react-bootstrap';
import './DetalleProducto.css'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router';
const DetalleProducto = () => {
  const { vendedorId, productoId } = useParams();
  console.log('Id vendedor' + vendedorId)
  console.log('Id producto' + productoId)
  const producto = productosMocked.data.find(p => p._id === productoId);
  const navigate = useNavigate();
  console.log(producto)
  return (
    <Container>
      <Button onClick={() => navigate(-1)} variant="primary" className="mb-4" aria-label='Boton para volver atras'>
      <IoArrowBackSharp aria-hidden='true'/>Volver a lista productos
    </Button>
    <div className="card">
        <h1 className='card-title'>{producto.titulo}</h1>
        <div className='card-body'>
          <h3>Precio: ${producto.precio} {producto.moneda === 'PESOS_ARG' ? '$' : producto.moneda === 'DOLAR_USA' ? 'U$D' : 'BRL'}</h3>
          <h4 className='text-muted'>Descripción: <br></br>{producto.descripcion}</h4>
          <h4>Categorias</h4>
          {producto.categorias.map(cat => <span key={cat._id} className="badge bg-secondary">{cat.nombre}</span>)}
          <Form>
            <label>Ingrese cantidad a comprar</label>
            <Form.Control
              type="number"
              min={0}
              max={producto.stock}
              placeholder="Cantidad"
              name="cantidad" />
            <button className="btn btn-primary">Agregar al carrito</button>
          </Form>
          <h4>Fotos:</h4>
          {producto.fotos.length ?
            <Carousel fade>
              {producto.fotos.map((foto, index) => (
                <Carousel.Item key={index} style={{ 'background-color': '#9b8a8aff' }}>
                  <img
                    className="d-block w-100 carousel-image"
                    src={foto}
                    alt="foto de producto" />
                </Carousel.Item>
              ))}
            </Carousel>
            : 'No hay fotos disponibles'}
        </div>

      </div></Container>
  )
}

export default DetalleProducto;