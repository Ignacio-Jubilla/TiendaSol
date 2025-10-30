import React, { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, ListGroup } from "react-bootstrap";
import { useParams } from "react-router";
import productosMocked from '../../mocks/productos.json';
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { MdDeleteForever } from "react-icons/md";

const CrearProducto = () => {
  const categoriasMock = [
    { nombre: "Electrodomestico" },
    { _id: "68d6cb9a842bb9825c606c64", nombre: "Ropa" },
    { _id: "68d6cb9a842bb9825c606c65", nombre: "Juguetes" },
    { _id: "68d6cb9a842bb9825c606c66", nombre: "Hogar" },
  ];

  //const [selectedCategory, setSelectedCategory] = useState("Bizarreadas");
  const [categories, setCategories] = useState(categoriasMock);
  const [selectedCategory, setSelectedCategory] = useState("")
  const [producto, setProducto] = useState({categoria: "Bizarreadas"})
  const [loading, setLoading] = useState(true)

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProducto({
      ...producto,
      [name]: value
    });
  };

  const handleAddCategory = () => {
    if (selectedCategory) {
      const newCategory = categories.find(c => c._id === selectedCategory);

      if (newCategory) {
          if (producto.categorias && producto.categorias.find(c => c._id === newCategory._id)) {
            alert("La categoría ya está agregada.");
            return;
          }
        if(producto.categorias) {
        setProducto({
          ...producto,
          categorias: [...producto.categorias, newCategory]
        }) }
        else {
          setProducto({
          ...producto,
          categorias: [newCategory]
        })
        }

        setSelectedCategory("");
      }
    }
  };

  const changeSelectedCategory = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleDeleteCategory = (id) => {
    setProducto({
      ...producto,
      categorias: producto.categorias.filter(c => c._id !== id)
    });
  };

  return (
    <>
      <Container className="my-4 p-2">
        <h1>Crear producto</h1>
        <Form role="">
          <Form.Group className="mb-3" controlId="tituloProducto">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Ingrese titulo" name="titulo" value={producto.titulo} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcionProducto">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control as="textarea" placeholder="Descripcion" name="descripcion" value={producto.descripcion} onChange={handleInputChange} />
          </Form.Group>


          <Form.Group className="mb-3" controlId="precioProducto">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" placeholder="Precio de producto" name="precio" value={producto.precio} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="tipoMoneda" className="mb-3">
            <Form.Label>Tipo de moneda</Form.Label>
            <Form.Select
              name="moneda"
              value={producto.moneda}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              <option value="DOLAR_USA">Dolar estadounidense</option>
              <option value="PESO_ARG">Peso arg.</option>
              <option value="REAL">Real</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="stockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" placeholder="stock de producto" name="stock" value={producto.stock} onChange={handleInputChange} />
          </Form.Group>
          <Button variant="success" type="submit">
            Finalizar
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default CrearProducto