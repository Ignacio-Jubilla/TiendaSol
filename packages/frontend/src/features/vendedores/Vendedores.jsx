import React from 'react';
import vendedoresMocked from '../../mocks/vendedores.json'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardVendedor from '../../components/cards/CardVendedor';
import './Vendedores.css'

const Vendedores = () => {
    //consultar vendedores en bd
    const vendedores = vendedoresMocked;
    return (
        <>
        <p>Aca van filtro de termino busqueda, page y perPage</p>
        <div className='grid-content'>
        {vendedores.data.map(vendedor => <CardVendedor key={vendedor._id}vendedor={vendedor} />)}
        </div>
        </>
    )
}

export default Vendedores