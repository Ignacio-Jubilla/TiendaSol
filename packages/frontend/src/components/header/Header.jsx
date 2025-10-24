import React, { use } from 'react';
import './Header.css';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import { HiBellAlert } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router';


const Header = () => {
  const [currentItems, setCurrentItems] = useState(0);
  const [currentNotifications, setCurrentNotificacion] = useState(0);
  const [valorBusqueda, setValorBusqueda] = useState("");
  const navigate = useNavigate()
  const handleSearchChange = (event) => {
    setValorBusqueda(event.target.value);
  }

const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/productos?valorBusqueda=${valorBusqueda}`);
  };

  return (
    <header className="d-flex flex-direction-row justify-content-between align-items-center" aria-label="Header" aria-description='Header principal de Tiendasol'>
      <div>
        <Link to="/" className="navbar-brand" aria-label="Boton homepage" aria-description="Boton para ir a homepage"><h1 id="title">TiendaSol</h1></Link>
      </div>
      
      <nav className="header-nav d-flex align-items-center gap-4" aria-label='Navbar' aria-description='barra de navegacion'>
        <div className="icon-group d-flex align-items-center gap-3">
          <Link
            to="/cart"
            className="icon-item position-relative"
            aria-label={`Ir a  carrito de compras, actualmente tienes ${currentItems} items`}
          >
            <FaShoppingCart size={22} />
            {currentItems}
          </Link>
          <Link
            to="/notificaciones"
            className="icon-item position-relative"
            aria-label={`Ir a notificaciones, actualmente tienes ${currentNotifications} notificaciones`}
          >
            <HiBellAlert size={22} />
            {currentNotifications}
          </Link>
        </div>

        {/* Navbar */}
        <Navbar expand="lg" className="p-0">
          <Container fluid>
            <Navbar.Toggle/>
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              placement="end"
              style={{"background-color": "#dfd9d9ff", "opacity": "0.9"}}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                  Navegación
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className=" flex-grow-1 pe-3">
                  <Link to="/vendedores" className="nav-link" aria-label='Ver vendedores'>Vendedores</Link>
                  <Link to="/pedidos" className="nav-link" aria-label='Ver mis pedidos'>Mis pedidos</Link>
                  <Link to="/mis-productos" className="nav-link" aria-label='Ver mis productos'>Mis productos</Link>
                </Nav>
            <Form className='d-flex flex-row' onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Buscar productos"
              className="me-1"
              aria-label="Search"
              onChange={handleSearchChange}
              value={valorBusqueda}
            />
            <Button variant="secondary" type="submit"><FaSearch aria-hidden="true"></FaSearch>Buscar</Button>
          </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </nav>
    </header>

  )
}
export default Header;