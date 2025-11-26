import React from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from "react-router";
import productos from "../../services/productos";
import { FaCartPlus } from "react-icons/fa";
import './CardProductoResumen.css'

const CarditemResumen = ({item, handleAddItem}) => {
  const getImageUrl = () => {
    if (item.fotos && item.fotos.length > 0) {
      return item.fotos[0];
    }
    return "https://placehold.co/600x400?text=Sin+imagen";
  };

const truncateText = (titulo) => {
  return titulo.length > 45 ? titulo.substring(0, 45) + "…" : titulo
}
  
  return ( 
    <div className="carousel-card">
<<<<<<< HEAD
    <Card>
      <Card.Img variant="top" src={getImageUrl()} style={{width: "10rem", height: "10rem"}}/>
=======
    <Card className="titulo-prod-resumen">
      <Card.Img variant="top" src={getImageUrl()} style={{width: "10rem"}, {height: "10rem"}}/>
>>>>>>> Entrega_4_Fixes_Varios
      <Card.Body>
        <Card.Title>{truncateText(item.titulo)}</Card.Title>
        <Card.Text>
          <p>  {item.precio} {item.moneda == "DOLAR_USA" ? "U$D" : item.moneda == "PESO_ARG" ? "$" : "BRL"}  </p>
        </Card.Text>
        <Card.Text className="text-muted">
          Disponible: {item.stock} unidades
        </Card.Text>
        <div className="d-flex justify-content-between">
        {Number(item.stock) > 0 ? <Button as={Link} to={`/productos/${item._id}`}>Ver más</Button> : <Button disabled>Sin stock</Button>}
        {Number(item.stock) > 0 ? <Button variant="success" onClick={()=>handleAddItem(item)}>
          <FaCartPlus size={30}></FaCartPlus>
          </Button> : null}
        </div>
      </Card.Body>
    </Card>
    </div>
  )
}

export default CarditemResumen