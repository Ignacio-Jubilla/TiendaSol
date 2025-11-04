import React, { use } from 'react';
import './Header.css';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { HiBellAlert } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router';
import { Dropdown, OverlayTrigger } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import carritoMock from '../../mocks/carrito.json'
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/authContext';
import authServices from '../../services/auth';
const Header = () => {
  const {totalCart, cartItems} = useCart()
  const {user, logoutContext} = useAuth()

  const [currentNotifications, setCurrentNotificacion] = useState(0);
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const navigate = useNavigate()

  const handleSearchChange = (event) => {
    setValorBusqueda(event.target.value);
  }
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => setExpanded(false);
  const handleLogout = async () => {
    try {
      authServices.logout()
    } catch (error) {
      console.log('nothing')
    }
    logoutContext()
    navigate('/')
  }
  const handleSearch = (e) => {
    e.preventDefault();
    handleClose()
    navigate(`/productos?valorBusqueda=${valorBusqueda}`);
  };

  const carritoPreview = (
    <Popover id="popover-carrito">
      <Popover.Header as="h3">Tu carrito</Popover.Header>
      <Popover.Body>
        {!totalCart ? (
          <p>El carrito está vacío</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {cartItems.map(item => (
              <li key={item.productoId}>
                {item.nombre} x {item.cantidad} (${item.precioUnitario * item.cantidad})
              </li>
            ))}
          </ul>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <header className="" aria-label="Header" aria-description='Header principal de Tiendasol'>
      <div className='d-flex align-items-center'>
        <Link to="/" className="navbar-brand" aria-label="Boton homepage" aria-description="Boton para ir a homepage"><h1 id="title">Tienda  Sol</h1></Link>
        {(user && user.tipo == "COMPRADOR") || !user ? 
        <Form className='d-flex my-3 container ms-5' onSubmit={handleSearch} >
          <Form.Control
            type="search"
            placeholder="Buscar productos"
            aria-label="Search"
            onChange={handleSearchChange}
            value={valorBusqueda}
          />
          <Button variant="secondary" type="submit" className='d-flex align-items-center'><FaSearch aria-hidden="true"></FaSearch></Button>
        </Form>  : null }
      </div>

      <Navbar expand="lg" expanded={expanded}
        className="header-nav d-flex align-items-center gap-4 justify-content-between" aria-label='Navbar' aria-description='barra de navegacion'
        onToggle={setExpanded}>
        <Navbar.Toggle />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          placement="end"
          style={{ "background-color": "#dfd9d9ff", "opacity": "0.9" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Navegación
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className=" flex-grow-1 pe-3 gap-3 align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                  <FaUser></FaUser>
                  {!user ? "Ingresa" : user.nombre}
                </Dropdown.Toggle>
 
                <Dropdown.Menu>
                  {user ? <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item> : 
                  <>
                 <Dropdown.Item as={Link} to={`/login`}>Iniciar sesión</Dropdown.Item><Dropdown.Item as={Link} to={`/register`}>Registrarse</Dropdown.Item>
                 </>
                  }
                </Dropdown.Menu>
              </Dropdown>
              {user ? <Link to="/pedidos" className="nav-link" aria-label='Ver mis pedidos' onClick={handleClose}>Mis pedidos</Link> : null}
              {user  && user.tipo == "VENDEDOR" ? <Link to="/mis-productos" className="nav-link" aria-label='Ver mis productos' onClick={handleClose}>Mis productos</Link> : null}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <div className="icon-group d-flex align-items-center gap-4 me-5">
          {user && user.tipo == "COMPRADOR" ? 
          <OverlayTrigger 
          placement="bottom" 
          overlay={carritoPreview}
          show={showPopover}
          >
            <div
              className="icon-item position-relative"
              onMouseEnter={() => setShowPopover(true)}
              onMouseLeave={() => setShowPopover(false)}
              onClick={() => setShowPopover(false)}
              aria-label={`Ir a carrito de compras, actualmente tienes ${totalCart} items`}
            >
              <Link to="/carrito">
                <FaShoppingCart size={30} />
                {totalCart}
              </Link>
            </div>
          </OverlayTrigger>
           : null}
           {user ?
          <Link
            to="/notificaciones"
            className="icon-item position-relative"
            aria-label={`Ir a notificaciones, actualmente tienes ${currentNotifications} notificaciones`}
          >
            <HiBellAlert size={30} />
            {currentNotifications}
          </Link>
           : null}
        </div>
      </Navbar>
    </header>

  )
}
export default Header;