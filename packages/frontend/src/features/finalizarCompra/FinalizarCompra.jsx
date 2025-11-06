import React, { useState } from "react";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
const FinalizarCompra = () => {
  const {groupItemsByVendedor} = useCart()
  const [direccionEntrega, setDireccionEntrega] = useState({})
  const handleSubmitPedido = (e) => {
    e.preventDefault()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDireccionEntrega({
      ...direccionEntrega,
      [name]: value
    });
  };

  /*
    items: z.array(itemPedidoSchemaZod).nonempty({ message: "Debe haber al menos un item" }),
    moneda: z.string().nonempty({ message: "Moneda es obligatoria" }),
    calle: z.string(),
    altura: z.string(),
    departamento: z.string().optional(),
    piso: z.string().optional(),
    codigoPostal: z.string(),
    ciudad: z.string(),
    provincia: z.string(),
    pais: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  */
  return (
    <Container>
      <h1>Ingrese datos de envio</h1>
      <Form onSubmit={handleSubmitPedido}>
        <Form.Group className="mb-3 rounded round-2 bg-light p-2" controlId="monedaPago">
          <Form.Label>Moneda de pago</Form.Label>
          <Form.Select required>
            <option value="PESO_ARG">ARS</option>
            <option value="DOLAR_USA">USD</option>
            <option value="REAL">BRL</option>
          </Form.Select>
        </Form.Group>
        <FormGroup>
          <Row>
          <Col lg={4}>
          <Form.Label>Calle:</Form.Label>
          <Form.Control type="text" minLength={3} placeholder="Calle" name="calle" value={direccionEntrega.calle} onChange={handleInputChange} required />
          </Col>
          <Col lg={4}>
          <Form.Label>Altura:</Form.Label>
          <Form.Control type="text" minLength={1} placeholder="altura" name="altura" value={direccionEntrega.altura} onChange={handleInputChange} required />
          </Col>
          <Col lg={4}>
          <Form.Label>Codigo postal:</Form.Label>
          <Form.Control type="text" minLength={1} placeholder="Codigo postal" name="codigoPostal" value={direccionEntrega.codigoPostal} onChange={handleInputChange} required/>
          </Col>
          </Row>
          <Row>
            <Col lg={6}>
          <Form.Label>Departamento:</Form.Label>
          <Form.Control type="text" minLength={1} placeholder="departamento" name="departamento" value={direccionEntrega.departamento} onChange={handleInputChange}/>
          </Col>
            <Col lg={6}>
          <Form.Label>Pîso:</Form.Label>
          <Form.Control type="text" minLength={1} placeholder="piso" name="piso" value={direccionEntrega.piso} onChange={handleInputChange} />
          </Col>
          </Row>      
        </FormGroup>
        <Button type="submit">Continuar</Button>
    </Form>
    </Container>
  )
}
export default FinalizarCompra;