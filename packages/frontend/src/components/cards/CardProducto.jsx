import React from 'react';
import PropTypes from 'prop-types'
import { Button, Form } from "react-bootstrap"
import { Link } from "react-router"
import './CardProducto.css'

const CardProducto = ({ producto }) => {
  return (
    <div className="card card-shadow-sm p-3 d-flex flex-row bg-dark-hover" key={producto.id}>
      <div className="card-body">
        <h5>{producto.titulo}</h5>
        <p>
          <strong>Precio:</strong> {producto.precio} {producto.moneda}
        </p>
        <p>
          <strong>Stock: {producto.stock}</strong>
        </p>
      </div>

      <div className="d-grid gap-1">
        <Button as={Link} to={`/vendedores/${producto.vendedor.id}/productos/${producto._id}`} variant="primary">
          Ver mas
        </Button>
        <Form>
          <Form.Control
            type="number"
            min={0}
            max={producto.stock}
            placeholder="Cantidad"
            name="cantidad"
          />
          <button className="btn btn-primary">Agregar al carrito</button>
        </Form>
      </div>
    </div>
  )
}

CardProducto.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titulo: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    moneda: PropTypes.string,
    stock: PropTypes.number,
    vendedor: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }).isRequired
}

export default CardProducto