import React from 'react'
import {Card, Button, Row, Col} from 'react-bootstrap';
import './CardNotificaciones.css'


const CardNotificaciones = ({notificacion, marcarLeida}) => {

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col>
            <Card.Text>
              {notificacion.mensaje}
            </Card.Text>
            <Card.Text>
              Leida: {new Date(notificacion.fechaLeida).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </Card.Text>
          </Col>
          { !notificacion.leida ? 
            <Col className="botonLeido">
              <Button variant="primary" onClick={() => marcarLeida(notificacion._id)}>Marcar leido</Button>
            </Col> : 
            null
          }
        </Row>
      </Card.Body>
    </Card>
  )
}

export default CardNotificaciones
