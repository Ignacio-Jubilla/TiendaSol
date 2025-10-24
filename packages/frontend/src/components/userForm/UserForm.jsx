import React from "react"
import { Button, Container, Form } from "react-bootstrap"

const UserForm = ({ onSubmit, title }) => {
  return (
    <Container className="d-flex justify-content-center mt-4">
      <Form>
        <Form.Text>
          <h1>{title}</h1>
        </Form.Text>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type="text" placeholder="Nombre de usuario" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" />
        </Form.Group>
        <Button>
          {title}
        </Button>
        <br />
        {title == "Iniciar sesión" ? <Form.Text>
          No tienes una cuenta? <a href="/register">Registrate</a>
        </Form.Text> : null}
      </Form>
    </Container>
  )
}

export default UserForm