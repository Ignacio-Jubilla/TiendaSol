import React, { useState } from "react"
import { Button, Container, Form, InputGroup, Row } from "react-bootstrap"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/authContext"
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importa los íconos
import ErrorMessage from "../../components/errorMessage/ErrorMessage"
import authServices from "../../services/auth"
import auth from "../../services/auth"
const Login = () => {
  const navigate = useNavigate();
  const {loginContext} = useAuth()
  const [errorMessage, setErrorMessage] = useState("")
  const [disabledButton, setDisabledButton] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: ""
  })

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  }
  
const showErrorMessage = (msg) => {
  setErrorMessage(msg)
  setTimeout(() => {
    setErrorMessage("")
  }, 5000)
}

  const handleChange = (e) => {

    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginCredentials.email || !loginCredentials.password) {
      showErrorMessage("Email o contraseña no pueden ser vacios")
      return ;
    }
    try {
      setDisabledButton(true)
      const data = await authServices.login(loginCredentials)
      loginContext(data.accessToken)
      navigate("/")
    } catch (error) {
      if(error.response.status === 401) {
      showErrorMessage("Credenciales incorrectas")
      } else {
        showErrorMessage("No se pudo iniciar sesion, intente nuevamente")
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
        {/* --- 5. CAMBIOS EN EL CAMPO DE CONTRASEÑA --- */}
    <Form.Group className="mb-3 col-12 col-lg-6 col-md-6" controlId="password">
     <Form.Label>Contraseña</Form.Label>
          <InputGroup>
       <Form.Control 
              // El tipo cambia dinámicamente
              type={showPassword ? "text" : "password"} 
              placeholder="Contraseña" 
              name="password" 
              onChange={handleChange}
            />

            <Button 
              variant="outline-secondary" 
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
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