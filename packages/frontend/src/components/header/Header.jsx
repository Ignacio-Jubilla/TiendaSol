import React from 'react';
import './Header.css';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {FaShoppingCart} from 'react-icons/fa'
import { HiBellAlert } from 'react-icons/hi2';
import { Link } from 'react-router';


const Header = () => {
  const [currentItems, setCurrentItems] = useState(0);
  const [currentNotifications, setCurrentNotificacion] = useState(0);
    return (
        <header className="d-flex flex-direction-row justify-content-between align-items-center">
            <div>
              <h1 id="title">TiendaSol</h1>
            </div>
             <nav className="header-nav d-flex align-items-center gap-4">
        <div className="icon-group d-flex align-items-center gap-3">
          <div className="icon-item position-relative">
            <FaShoppingCart size={22} />
            {currentItems}
          </div>
          <div className="icon-item">
            <HiBellAlert size={24} />
            {currentNotifications}
          </div>
        </div>

        {/* Navbar */}
        <Navbar expand="lg" className="p-0">
          <Container fluid>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
              className="bg-warning"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                  Navegación
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link to="/vendedores" className="nav-link">Vendedores</Link>
                  <Nav.Link href="#pedidos">Mis pedidos</Nav.Link>
                  
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </nav>
    </header>

    )
}
export default Header;