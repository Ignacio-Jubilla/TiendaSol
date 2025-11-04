import React from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from "react-router";

const CarditemResumen = ({item}) => {
  const getImageUrl = () => {
    if (item.fotos && item.fotos.length > 0) {
      return item.fotos[0];
    }
    return "https://placehold.co/600x400?text=Sin+imagen";
  };

  return ( 
    <div className="carousel-card">
    <Card>
      <Card.Img variant="top" src={getImageUrl()} style={{width: "10rem"}, {height: "10rem"}}/>
      <Card.Body>
        <Card.Title>{item.titulo}</Card.Title>
        <Card.Text>
          {item.precio}
        </Card.Text>
        <Card.Text>
          moneda: {item.moneda}
        </Card.Text>
        {Number(item.stock) > 0 ? <Button as={Link} to={`/productos/${item._id}`}>Ver más</Button> : <Button disabled>Sin stock</Button>}
      </Card.Body>
    </Card>
    </div>
  )
}

export default CarditemResumen