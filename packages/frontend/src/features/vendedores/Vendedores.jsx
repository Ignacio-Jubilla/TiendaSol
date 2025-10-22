import React, { useEffect, useState } from 'react';
import vendedoresMocked from '../../mocks/vendedores.json'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardVendedor from '../../components/cards/CardVendedor';
import './Vendedores.css'
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { Col, Container, Row } from 'react-bootstrap';
import FiltrosVendedor from '../filtrosVendedor/FiltrosVendedor';
import ControlPaginado from '../../components/controlPaginado/ControlPaginado';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import { useSearchParams } from 'react-router';

const Vendedores = () => {
    //consultar vendedores en bd
    const [searchParams, setSearchParams] = useSearchParams({});
    const [filtros, setFiltros] = useState({});
    const [vendedores, setVendedores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(vendedoresMocked.pagination);
    const [errorMessage, setErrorMessage] = useState("")

    setTimeout(() => {
        setVendedores(vendedoresMocked.data);
        setLoading(false);
    }, 3000);

    const handleFiltrar = (filtros) => {        
        //llamar a api con {...filtros}
        alert('llamado a api con filtros')
        if (loading) {
            showErrorMessage("Espere a que carguen los vendedores")
            return;
        }
        setFiltros(filtros)
        console.log('llamar a api con filtros')
        
        setSearchParams({ ...filtros, page: 1 });
        //cambiar pagination por respuesta de api
        console.log(filtros)
    };

    const handleChangePage = (page) => {
        if (loading) {
            showErrorMessage("Espere a que carguen los vendedores")
            return
        }
        setPagination({ ...pagination, page});
        console.log("llamado a api de pagina " + page)
        setSearchParams({ ...filtros, page: page });
    };

    const showErrorMessage = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => {
            setErrorMessage("");
        }, 6000);
    }
    
    useEffect(() => {        
        setFiltros(Object.fromEntries(searchParams.entries()));
    }, [searchParams]);

    return (
        <Container className='mt-4'>
            <ErrorMessage msg={errorMessage} />
            <Row>
                <Col lg={3} md={5} xs={12} className="mb-4">
                    <FiltrosVendedor handleSubmit={handleFiltrar} filtrosActuales={Object.fromEntries(searchParams.entries())}/>
                </Col>
                <Col lg={9} md={7} xs={12}>
                <h1>Lista de vendedores</h1>
                <ControlPaginado onPageChange={handleChangePage} pagination={pagination}></ControlPaginado>
                    {loading ? <LoadingSpinner message="Cargando vendedores" /> : vendedores.length === 0 ? <p>No se encontraron vendedores.</p> :
                        <div className='grid-content'>
                            {vendedores.map(vendedor => <CardVendedor key={vendedor._id} vendedor={vendedor} />)}
                        </div>}
                </Col>
            </Row>
        </Container>
    )
}


export default Vendedores