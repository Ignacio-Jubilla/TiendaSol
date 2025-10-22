import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { IoArrowBackSharp } from "react-icons/io5";
import { Form, Button, Card, Accordion, Spinner } from "react-bootstrap";
import productosMocked from "../../mocks/productos.json";
import CardProducto from "../../components/cards/CardProducto";
import FiltrosBusqueda from "../FiltrosBusqueda/FiltrosBusqueda";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import ControlPaginado from "../../components/controlPaginado/ControlPaginado";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import { useNavigate } from "react-router";
import { useSearchParams } from 'react-router';

const ProductosVendedor = () => {
  const { vendedorId } = useParams();
  const [productos, setProductos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams({});
  const [filtros, setFiltros] = useState({});
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate();
  const productosData = productosMocked
  setTimeout(() => {
    setProductos(productosMocked.data)
    setLoading(false)
  }, 3000)

  const [pagination, setPagination] = useState(productosData.pagination);

  const showErrorMessage = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage("");
    }, 6000);
  }

  const handleFiltrar = (filtros) => {
    //llamar a api con {...filtros}
    if (loading) {
      showErrorMessage("Espere a que carguen los vendedores")
      return
    }
    alert('llamado a api con filtros')
    setFiltros(filtros)

    if (filtros.precioMin && filtros.precioMax && filtros.precioMin > filtros.precioMax) {
      setErrorMessage("El precio mínimo no puede ser mayor al precio máximo")
      return;
    }

    setSearchParams({ ...filtros, page: 1 });

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 5000)
    //cambiar pagination por respuesta de api
  };

  const handlePageChange = (page) => {
    if (loading) {
      showErrorMessage("Espere a que carguen los vendedores")
      return
    }
    setPagination({ ...pagination, page });
    console.log('nueva page: ' + page)
    setSearchParams({ ...filtros, page: page });
    //llamar a api con {...filtrosActuales, page}
    console.log("llamado a api de pagina " + page)
  };
  useEffect(() => {
    setFiltros(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  return (
    <div className="container mt-4">
      <ErrorMessage msg={errorMessage} />
      <div className="mb-5">
        <Button
          variant="primary"
          // 2. Llama a navigate(-1) en el onClick
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        ><IoArrowBackSharp></IoArrowBackSharp>
          Volver a lista vendedores</Button>
      </div>
      <div className="row">
        <div className="mb-4 col-lg-3 col-md-5 col-12">
          <FiltrosBusqueda onSubmit={handleFiltrar} filtrosActuales={Object.fromEntries(searchParams.entries())} />
        </div>

        <main className="col-lg-9 col-md-7 col-12 ">
          <h1 className="mb-4">Productos del Vendedor</h1>
          {loading ? (
            <LoadingSpinner message="Cargando productos" />
          ) : productos.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            <>
              <ControlPaginado onPageChange={handlePageChange} pagination={pagination} />
              {productos.map((p) => (
                <CardProducto key={p.id || p._id} producto={p} />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProductosVendedor;