import React from 'react';
import PropTypes from 'prop-types'
import { Button, Card, Form } from "react-bootstrap"
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router"
import './CardProducto.css'

const CardProductoVendedor = ({ producto }) => {
  const getImageUrl = () => {
    if (producto.fotos && producto.fotos.length > 0) {
      return producto.fotos[0];
    }
    return "https://placehold.co/600x400?text=Sin+imagen";
  };
  return (
    <section className="card card-shadow-sm p-3 d-flex flex-row bg-dark-hover" key={producto.id}>
      <div className="product-img d-flex">
        <img src={getImageUrl()} alt={producto.titulo} className="card-img-top" aria-label='Imagen de producto'/>
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

      <div className="d-grid gap-1">
        <Button as={Link} to={`/productos/${producto._id}/editar`}
         variant="primary">
          Editar
        </Button>
        <Button variant='danger'>
          <MdDeleteForever style={{"font-size": "2rem"}}/>
          Dar de baja
        </Button>
      </div>
    </section>
  )
}

export default CardProductoVendedor;