import React, { useEffect, useState } from "react";
import { Spinner, Alert, Row, Col } from "react-bootstrap";
import itemPedidosService from "../../services/ItemPedidos.js";
import CardItemPedido from "../../components/cards/CardItemPedido.jsx";
import ControlPaginado from '../../components/controlPaginado/ControlPaginado';

const MisItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    PorPagina: 5,
    total: 0,
    total_pages: 1
  });
    

  const vendedorId = JSON.parse(localStorage.getItem("user")).id;

  const fetchItems = async (page=1) => {
    try {
      setLoading(true);
      const response = await itemPedidosService.obtenerItemsVendedor({ vendedorId, page, limit: pagination.PorPagina });
      setItems(response.data || []);
      const paginaActual = response.pagina || 1;
      const porPaginaActual = response.PorPagina || 5; 
      const totalItems = response.total || 0;
      const totalPaginas = response.totalPaginas || 1;
      
      setPagination({
        page: paginaActual,
        PorPagina: porPaginaActual,
        total: totalItems,
        total_pages: totalPaginas
    });
    } catch (err) {
      console.error(err);
      setError("Error al obtener tus items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onEstadoCambiado = async (itemId, nuevoEstado) => {
    try {
      await itemPedidosService.cambiarEstadoItemPedido(itemId, nuevoEstado);
      fetchItems(); // refresca la lista después del cambio
    } catch (err) {
      console.error(err);
      alert("No se pudo cambiar el estado del item");
    }
  };

    const handleChangePage = async(page) => {
      if(loading) return;
      fetchItems(page);
    };

  if (loading) return <Spinner animation="border" className="m-3" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Mis items</h2>
      {items.length > 0 && (
        <Row className="mb-3">
          <Col xs={12}>
            <ControlPaginado onPageChange={handleChangePage} pagination={pagination} />
          </Col>
        </Row>
      )}
      {items.length === 0 ? (
        <p>No hay items pendientes de tus productos.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map(item => (
            <CardItemPedido
              key={item._id}
              item={item}
              onEstadoCambiado={onEstadoCambiado}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisItems;
