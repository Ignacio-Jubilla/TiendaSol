import { Button, Card } from "react-bootstrap"
import './CardVendedor.css'
import { Link } from "react-router"
const CardVendedor = ({ vendedor }) => {
  return (
    <Card key={vendedor._id} className="text-center">
      <Card.Body>
        <Card.Title>{vendedor.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Contactos</Card.Subtitle>
        <Card.Text>
          Email {vendedor.email}
        </Card.Text>
        <Card.Text>
          Tel: {vendedor.telefono}
        </Card.Text>
        <Button as={Link} to={`/vendedores/${vendedor._id}/productos`} >
          Ver productos
        </Button>
      </Card.Body>
      
    </Card>
  )
}

export default CardVendedor