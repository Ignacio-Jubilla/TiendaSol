import React, { useEffect, useState } from 'react';
import './MainPage.css';
import Logo from "../../media/tiendaSolLogo.png"
import { Card, CarouselItem, Container } from 'react-bootstrap';
import productosService from '../../services/productos';
import vendedoresService from '../../services/vendedores';
import vendedoresMocked from '../../mocks/vendedores.json';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import CardProductoResumen from '../../components/cards/CardProductoResumen';
import Vendedores from '../../services/vendedores';
import CarouselItems from '../../components/productosCarousel/CarouselItems';
import CardVendedor from '../../components/cards/CardVendedor';

const MainPage = () => {
  const [productos, setProductos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [categorias, setCategorias] = useState(["bizarreadas", "electrodomesticos", "sas", "roots"])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const fetchProductos = async () => {
      try {
      const productosApi = await productosService.getProductosMasVendidos()
      if (productosApi) {
      setProductos(productosApi.data)
      //TODO modificar backend luego
      //falta fetchear vendedores desde backend
      //const vendedoresApi = vendedoresService.getMejoresVendedores()
      const vendedoresApi = vendedoresMocked.data
      setVendedores(vendedoresApi)
      }
      //falta fetchear categorias desde backend
      } catch(err) {
        setErrorMessage('No se pudo comunicar con el servidor, intente nuevamente o vuelva luego')
      } finally{
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchProductos()
  }, [])

  return (
    <>
    <Container>
      <div className='d-flex justify-content-center mt-4 rounded-3 align-items-center border border-2 border-dark ' style={{backgroundColor: "#d9dfafff"}}>
        <img src={Logo} style={{ "width": "7rem" }} />
        <h1>Explora nuestro principal catalogo</h1>
      </div>
      {errorMessage ? <ErrorMessage msg={errorMessage}></ErrorMessage> : null}
      <section className='border border-2 border-dark mt-4 rounded-3 text-center'>
      <h3 className='my-2 section-title'>Los mas vendidos</h3>
      {loading ? <p>Cargando</p> : 
        productos && productos.length > 0 ? <CarouselItems items={productos} CardItem={CardProductoResumen}></CarouselItems>
       : <p>No se encontraron productos</p>}
      </section><section className='border border-2 border-dark mt-4 rounded-3 text-center'>
        <h3>Mejores vendedores</h3>
        {vendedores && vendedores.length > 0 ? <CarouselItems items={vendedores} CardItem={CardVendedor}></CarouselItems>: <p>No se encontraron vendedores</p>}
      </section><section className='border border-2 border-dark mt-4 rounded-3 text-center mb-4'>
        <h3 className='my-2 section-title'>Categorias</h3>
        {categorias && categorias.length > 0 ? <p>Categorias</p> : <p>No se encontraron categorias</p>}
      </section>
      </Container>
      </>
  )
}

export default MainPage;