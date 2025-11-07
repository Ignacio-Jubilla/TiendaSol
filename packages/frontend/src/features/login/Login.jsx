import React, { useState } from "react"
import { Button, Container, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/authContext"
import ErrorMessage from "../../components/errorMessage/ErrorMessage"
import authServices from "../../services/auth"
import auth from "../../services/auth"
const Login = () => {
  const navigate = useNavigate();
  const {loginContext} = useAuth()
  const [errorMessage, setErrorMessage] = useState("")
  const [disabledButton, setDisabledButton] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginCredentials.email || !loginCredentials.password) {
      setErrorMessage("Email o contraseña no pueden ser vacios")
      return ;
    }
    try {
      setDisabledButton(true)
      const data = await authServices.login(loginCredentials)
      loginContext(data.accessToken)
      navigate("/")
    } catch (error) {
      if(error.response.status === 401) {
      setErrorMessage("Credenciales incorrectas")
      } else {
        setErrorMessage("No se pudo iniciar sesion, intente nuevamente")
      }
    }finally{
      setDisabledButton(false)
    }
    }
  return (
    <Container className="justify-content-center mt-4">
      <ErrorMessage msg={errorMessage} />
      <Form>
        <Form.Text>
          <h1>Iniciar sesion</h1>
        </Form.Text>
        <Row>
        <Form.Group className="mb-3 col-12 col-lg-6 col-md-6" controlId="username">
          <Form.Label>Correo electronico</Form.Label>
          <Form.Control type="text" placeholder="user@gmail.com" name="email" onChange={handleChange}/>
        </Form.Group>
        <Form.Group className="mb-3 col-12 col-lg-6 col-md-6" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" name="password" onChange={handleChange}/>
        </Form.Group>
        </Row>
        <Button disabled={disabledButton} variant="primary" type="submit" onClick={handleLogin}>
          Iniciar Sesion
        </Button>
        <br />
        <Form.Text>
          No tienes una cuenta? <a href="/register">Registrate</a>
        </Form.Text>
      </Form>
    </Container>
  )
}

export default Login