import React, { useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, ListGroup } from "react-bootstrap";
import { useParams } from "react-router";
import productosMocked from '../../mocks/productos.json';
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { MdDeleteForever } from "react-icons/md";

const EditarProducto = () => {
  const categoriasMock = [
    { _id: "68d6cb9a842bb9825c606c63", nombre: "Electrodomestico" },
    { _id: "68d6cb9a842bb9825c606c64", nombre: "Ropa" },
    { _id: "68d6cb9a842bb9825c606c65", nombre: "Juguetes" },
    { _id: "68d6cb9a842bb9825c606c66", nombre: "Hogar" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState(categoriasMock);

  const { productoId } = useParams();
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)

  const productosData = productosMocked
  useEffect(() => {
    setTimeout(() => {
      setProducto(productosMocked.data.find(p => p._id === productoId))
      setLoading(false)
    }, 3000)
  }, [])

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
        if (producto.categorias.find(c => c._id === newCategory._id)) {
          alert("La categoría ya está agregada.");
          return;
        }

        setProducto({
          ...producto,
          categorias: [...producto.categorias, newCategory]
        });

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
      {loading || !producto ? <LoadingSpinner message="Cargando producto" /> :
        <Container className="my-4 p-2">
          <Form role="">
            <Form.Group className="mb-3" controlId="tituloProducto">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese titulo" name="titulo" value={producto.titulo} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcionProducto">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control as="textarea" placeholder="Descripcion" name="descripcion" value={producto.descripcion} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="categoriasProducto">
              <Form.Label>Categorías</Form.Label>

              <ListGroup>
                {producto.categorias ? (
                  producto.categorias.map(c => (
                    <ListGroup.Item
                      key={c._id}
                      className="d-flex justify-content-between"
                    >
                      {c.nombre}
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteCategory(c._id)}
                        aria-label={`Quitar categoría ${c.nombre} del producto`}
                        aria-hidden='true'
                      >
                        <MdDeleteForever />
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Sin categorias.</ListGroup.Item>
                )}
              </ListGroup>

              <InputGroup>
                <Form.Select
                  value={selectedCategory}
                  onChange={changeSelectedCategory}
                  aria-label="Agregar categoria a producto"
                >
                  <option value="">Seleccionar</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-success"
                  onClick={handleAddCategory}
                >
                  Agregar
                </Button>
              </InputGroup>
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
                <option value={producto.moneda}>{producto.moneda}</option>
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
        </Container>}
    </>
  )
}

export default EditarProducto;
