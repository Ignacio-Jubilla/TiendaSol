import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Button, Card, Form } from "react-bootstrap"
import { MdDeleteForever, MdWidthFull } from "react-icons/md";
import { Link } from "react-router"
import './CardProducto.css'
import ModalAlert from '../modalAlert/ModalAlert';

const CardProductoVendedor = ({ producto }) => {
  const getImageUrl = () => {
    if (producto.fotos && producto.fotos.length > 0) {
      return producto.fotos[0];
    }
    return "https://placehold.co/600x400?text=Sin+imagen";
  };

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false);
  const handleModalSubmit = () => {
    //dar de baja producto usando service;
    //volver a fetchear producto
    console.log('dio de baja producto con id ' + producto._id)
    producto.activo = false;
    setShow(false)
  }

  return (
    <section className="card card-shadow-sm p-3 d-flex flex-row bg-dark-hover" key={producto._id}>
      <ModalAlert handleClose={handleClose} handleModalSubmit={handleModalSubmit} message={"¿Esta seguro de que quiere dar de baja el producto?"} show={show}></ModalAlert>
      <div className="product-img d-flex">
        <img src={getImageUrl()}  className="card-img-top" aria-label='Imagen de producto'/>
      </div>
      <div className="card-body">
        <Card.Title>{producto.titulo}</Card.Title>
        <p>
          <strong>Precio:</strong> {producto.precio} {producto.moneda}
        </p>
        <p>
          <strong>Stock: {producto.stock}</strong>
        </p>
        {producto.categorias.map(cat => <span key={cat._id} className="badge bg-secondary">{cat.nombre}</span>)}
      </div>

      <div
  className="d-grid gap-1 align-items-center justify-content-center"
  style={{ 
    minWidth: '10rem' 
  }}>
        <Button as={Link} to={`/productos/${producto._id}/editar`}
         variant="primary" style={{ 
    minWidth: '10rem' 
  }}>
          Editar
        </Button>
        {producto.activo ?
        <Button variant='danger' onClick={() => {setShow(true)}} >
          <MdDeleteForever style={{"font-size": "2rem"}}/>
          Dar de baja
        </Button> : null}
      </div>
    </section>
  )
}

export default CardProductoVendedor;