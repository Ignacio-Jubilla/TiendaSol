import React from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { Form, Button, Card, Accordion } from "react-bootstrap";
import productosMocked from "../../mocks/productos.json";
import CardProducto from "../../components/cards/CardProducto";
import FiltrosBusqueda from "../FiltrosBusqueda/FiltrosBusqueda";
const ProductosVendedor = () => {
  const { vendedorId } = useParams();

  // Estados
  const productosData = productosMocked
  const productos = productosData.data
  const loading = false
  const [pagination, setPagination] = useState(productosData.pagination);

  const handleFiltrar = (filtros) => {
    // Aquí harías la llamada a la API con los filtros
    // y actualizarías el estado de los productos y la paginación.
    // Por ejemplo:
    // fetchProducts(filtros).then(data => {
    //   setProductos(data.data);
    //   setPagination(data.pagination);
    // });
    if( filtros.page) setPagination({...pagination, page: filtros.page})
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* --- Filtros --- */}
        <div className="mb-4 col-lg-3 col-md-5 col-12">
          <div className="d-none d-lg-block d-md-block">
            {<FiltrosBusqueda onSubmit={handleFiltrar} pagination={pagination} />}
          </div>
          <div className="d-lg-none d-md-none">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Filtros</Accordion.Header>
                <Accordion.Body>
                  <FiltrosBusqueda onSubmit={handleFiltrar} pagination={pagination}/>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        <div className="col-lg-9 col-md-7 col-12">
          <h1 className="mb-4">Productos del Vendedor</h1>

          {loading ? (
            <p>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <>
              {productos.map((p) => (
                <CardProducto key={p.id || p._id} producto={p} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductosVendedor;