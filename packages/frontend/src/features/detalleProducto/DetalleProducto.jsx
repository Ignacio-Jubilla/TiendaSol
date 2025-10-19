import React from 'react';
import { useParams } from 'react-router';
import productosMocked from '../../mocks/productos.json';
import { Carousel, Form } from 'react-bootstrap';
import './DetalleProducto.css'
const DetalleProducto = () => {
  const { vendedorId, productoId } = useParams();
  console.log('Id vendedor' + vendedorId)
  console.log('Id producto' + productoId)
  const producto = productosMocked.data.find(p => p._id === productoId);

  console.log(producto)
  return (
    <div className="container card">
      <h1 className='card-title'>{producto.titulo}</h1>
      <div className='card-body'>
        <h3>Precio: ${producto.precio} {
          producto.moneda === 'PESOS_ARG' ? '$' : producto.moneda === 'DOLAR_USA' ? 'U$D' : 'BRL'
        }</h3>
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
            name="cantidad"
          />
          <button className="btn btn-primary">Agregar al carrito</button>
        </Form>
        <h4>Fotos:</h4>
        {producto.fotos.length ?
        <Carousel fade>
            {producto.fotos.map((foto, index) => (
              <Carousel.Item key={index} style={{'background-color': '#9b8a8aff'}}>
                <img
                  className="d-block w-100 carousel-image"
                  src={foto}
                  alt="foto de producto" />
              </Carousel.Item>
            ))}
          </Carousel>
          : 'No hay fotos disponibles'}
      </div>
    
    </div>
  )
}

export default DetalleProducto;