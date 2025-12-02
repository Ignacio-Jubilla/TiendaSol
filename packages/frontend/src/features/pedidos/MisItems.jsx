import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import itemPedidosService from "../../services/ItemPedidos.js";
import CardItemPedido from "../../components/cards/CardItemPedido.jsx";

const MisItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendedorId = JSON.parse(localStorage.getItem("user")).id;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemPedidosService.obtenerItemsVendedor({ vendedorId });
      setItems(response.data || []);
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

  if (loading) return <Spinner animation="border" className="m-3" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Mis items</h2>
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
