/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./features/layout/Layout.jsx";
import Home from "./features/home/Home";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Vendedores from "./features/vendedores/Vendedores.jsx";
import ProductosVendedor from "./features/productos/ProductosVendedor.jsx";
import DetalleProducto from "./features/detalleProducto/DetalleProducto.jsx";
import MisProductos from "./features/misProductos/MisProductos.jsx";
import EditarProducto from "./features/editarProducto/EditarProducto.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout  />} >
          <Route index element={<Home />} />
          <Route path="/mis-productos" element={<MisProductos />} />
          <Route path="/vendedores" element={<Vendedores/>} />
          <Route path="/productos/:productoId/editar" element={<EditarProducto/>} />
          <Route path="/vendedores/:vendedorId/productos" element={<ProductosVendedor />} />
          <Route path="/vendedores/:vendedorId/productos/:productoId" element={<DetalleProducto/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;