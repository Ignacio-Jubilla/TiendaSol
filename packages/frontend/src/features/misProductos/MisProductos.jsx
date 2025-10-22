import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FiltrosBusquedaProductosVendedor from '../filtrosBusquedaProductosVendedor/FiltrosBusquedaProductosVendedor';
import productosMocked from '../../mocks/productos.json'
import CardProducto from '../../components/cards/CardProducto';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import ControlPaginado from '../../components/controlPaginado/ControlPaginado';
import CardProductoVendedor from '../../components/cards/CardProductoVendedor';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import { useSearchParams } from 'react-router';

const MisProductos = () => {
  const [productos, setProductos] = useState(null)
  const [pagination, setPagination] = useState(productosMocked.pagination)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [searchParams, setSearchParams] = useSearchParams({});
  const [filtros, setFiltros] = useState({});

  const showErrorMessage = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage("");
    }, 6000);
  }

  const handleFiltrar = (filtros) => {
    if (loading) {
      showErrorMessage("Espere a que carguen los productos")
      return
    }
    alert('llamado a api con filtros' + filtros)

    setSearchParams({ ...filtros, page: 1 });
    setFiltros(filtros)
    
    setTimeout(() => {
      setProductos(productosMocked.data)
      setLoading(false)
    }, 3000)
  }

  const handleChangePage = (page) => {
    if (loading) {
      showErrorMessage("Espere a que carguen los productos")
      return
    }

    setPagination({ ...pagination, page })
    setSearchParams({ ...filtros, page: page });
    alert('llamado a api de pagina ' + page)
  }

  setTimeout(() => {
    setProductos(productosMocked.data)
    setLoading(false)
  }, 3000)

useEffect(() => {        
        setFiltros(Object.fromEntries(searchParams.entries()));
    }, [searchParams]);

  return (
    <Container className='mt-4'>
      <ErrorMessage msg={errorMessage} />
      <Row>
        <Col lg={3} md={5} xs={12} className="mb-4">
          <FiltrosBusquedaProductosVendedor onSubmit={handleFiltrar} filtrosActuales={Object.fromEntries(searchParams.entries())}/>
        </Col>
        <Col lg={9} md={7} xs={12}>
          <ControlPaginado onPageChange={handleChangePage} pagination={pagination}></ControlPaginado>
          {loading ? <LoadingSpinner message="Cargando prductos" /> : productos.length === 0 ? <p>No se encontraron producto.</p> :
            productos.map(producto => <CardProductoVendedor producto={producto} key={producto._id} />)
          }
        </Col>
      </Row>
    </Container>
  )
}

export default MisProductos;