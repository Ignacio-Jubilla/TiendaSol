/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./features/layout/Layout.jsx";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Vendedores from "./features/vendedores/Vendedores.jsx";
import ProductosVendedor from "./features/productos/ProductosVendedor.jsx";
import DetalleProducto from "./features/detalleProducto/DetalleProducto.jsx";
import MisProductos from "./features/misProductos/MisProductos.jsx";
import EditarProducto from "./features/editarProducto/EditarProducto.jsx";
import CrearProducto from "./features/crearProducto/CrearProducto.jsx";
import Login from "./features/login/Login.jsx";
import Register from "./features/register/Register.jsx";
import LandingPage from "./features/home/LandingPage.jsx";
import MainPage from "./features/mainPage/MainPage.jsx";
import MisPedidos from "./features/pedidos/MisPedidos.jsx";
import DetallePedido from "./features/detallePedido/detallePedido.jsx"
import Carrito from "./features/carrito/carrito.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Notificaciones from "./features/notificaciones/Notificaciones.jsx";
import NotFound from "./features/notFound/NotFound.jsx";
import { AuthProvider } from "./context/authContext.jsx";

function App() {
  return (
    <BrowserRouter>
    <CartProvider>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout  />} >
          <Route index element={<MainPage/>} />
          <Route path="/landing" element={<LandingPage/>}/>
          <Route path="/mis-productos" element={<MisProductos />} />
          <Route path="/mis-productos/crear" element={<CrearProducto />} />
          <Route path="/vendedores" element={<Vendedores/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/productos/:productoId/editar" element={<EditarProducto/>} />
          <Route path="/productos/:productoId" element={<DetalleProducto/>} />
          <Route path="/productos" element={<ProductosVendedor />} />
          <Route path="/pedidos" element={<MisPedidos/>}/>
          <Route path="/pedidos/:pedidoId" element={<DetallePedido/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;