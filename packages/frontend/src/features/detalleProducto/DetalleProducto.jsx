import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import productosMocked from '../../mocks/productos.json';
import { Button, Carousel, Container, Form } from 'react-bootstrap';
import './DetalleProducto.css'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router';
import productosService from '../../services/productos';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { useCart } from '../../context/CartContext';
const DetalleProducto = () => {
  const { vendedorId, productoId } = useParams();
  const [loading, setLoading] = useState(true)
  const [producto, setProducto] = useState(null)
  const {addItemToCart} = useCart()
  const handleAddItem = (producto, cantidad) => {
    addItemToCart(producto, cantidad);
  };
  const [cantidad, setCantidad] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProduct = async() => {
    const dataApi = await productosService.getProducto(productoId);
    if (dataApi) {
      setProducto(dataApi)
    } else {
      showErrorMessage("No se pudo obtener producto, intente luego")
    }
    setLoading(false)
  }
  fetchProduct()
  }, [])

  return (
    <Container className='mt-4'>
      <Button onClick={() => navigate(-1)} variant="primary" className="mb-4" aria-label='Boton para volver atras'>
      <IoArrowBackSharp aria-hidden='true'/>Volver a lista productos
    </Button>
    {loading ? <LoadingSpinner message="Cargando producto" /> :
      !producto ? <h1>Producto no encontrado</h1> : 
    <div className="card p-3 mb-4">
        <h1 className='card-title'>{producto.titulo}</h1>
        <div className='card-body'>
          <h4>Precio: {producto.precio} {producto.moneda === 'PESO_ARG' ? '$' : producto.moneda === 'DOLAR_USA' ? 'U$D' : 'BRL'}</h4>
          <h4 className='text-muted'>Descripción: <br></br>{producto.descripcion}</h4>
          <h4>Categorias</h4>
          {producto.categorias.map(cat => <span key={cat._id} className="badge bg-secondary">{cat.nombre}</span>)}
          <Form onSubmit={(e) => {
            e.preventDefault()
            //logica para agregar a carrito
            if (cantidad >= 0 && cantidad <= producto.stock) {
              handleAddItem(producto, cantidad)
            }
          }}>
            <Form.Label>Ingrese cantidad a comprar</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
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

      </div>}</Container>
  )
}

export default DetalleProducto;