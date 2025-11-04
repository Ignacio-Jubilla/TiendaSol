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
import LoadingProduct from '../../components/loadingProduct/LoadingProduct';
import LoadingVendedor from '../../components/loadingVendedor/LoadingVendedor';
import CardCategoria from '../../components/cards/CardCategoria';

const MainPage = () => {
  const [productos, setProductos] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const fetchProductos = async () => {
      try {
      const productosApi = await productosService.getProductosMasVendidos()
      setProductos(productosApi.data)
      const vendedoresApi = vendedoresMocked.data
      setVendedores(vendedoresApi)
      const categoriasApi = await productosService.getCategorias()
      console.log(categoriasApi)
      setCategorias(categoriasApi)
    }
      //falta fetchear categorias desde backend
       catch(err) {
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
      {loading ? 
      <div className="d-flex justify-content-between">
        {[1,2,3].map( (numero) => <LoadingProduct key={numero}/>)}
      </div> : 
        productos && productos.length > 0 ? <CarouselItems items={productos} CardItem={CardProductoResumen}></CarouselItems>
       : <p>No se encontraron productos</p>}
      </section>
      <section className='border border-2 border-dark mt-4 rounded-3 text-center mb-4'>
        <h3 className='my-2 section-title'>Categorias</h3>
        {categorias && categorias.length > 0 ? 

        <CarouselItems items={categorias} CardItem={CardCategoria}></CarouselItems>
        : <p>No se encontraron categorias</p>}


      </section>
      </Container>
      </>
  )
}

export default MainPage;