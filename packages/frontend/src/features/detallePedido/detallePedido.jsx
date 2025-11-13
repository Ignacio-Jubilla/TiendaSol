import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Table,Button } from 'react-bootstrap';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import pedidoService from '../../services/pedidos.js';


// Función para darle color al estado
const estadoColor = (estado) => {
    switch (estado) {
        case "PENDIENTE": return "secondary";
        case "CONFIRMADO": return "primary";
        case "EN_PREPARACION": return "warning";
        case "ENVIADO": return "info";
        case "ENTREGADO": return "success";
        case "CANCELADO": return "danger";
        default: return "light";
    }
  };

const DetallePedido = () => {
  const { pedidoId } = useParams();
  const navegar = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPedido = async () => {
      setLoading(true);
      try {
        // el backend devuelve { data: [...], pagination: {...} }
        const response = await pedidoService.obtenerPedidos({ pedidoId });
        const pedidoEncontrado = Array.isArray(response.data) ? response.data.find(p => p._id === pedidoId) : null;
        if (pedidoEncontrado) {
          setPedido(pedidoEncontrado);
        } else {
          setErrorMessage("Pedido no encontrado");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Error al cargar el pedido");
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) fetchPedido();
  }, [pedidoId]);
  
  const handleCancelarPedido = async () => {
    if (!pedido) return;
    const confirmacion = window.confirm("¿Deseás cancelar este pedido?");
    if (!confirmacion) return;
    
    setLoading(true);
    try {
      await pedidoService.actualizarEstadoPedido(pedido._id, "CANCELADO", { motivo: "Cancelado por el usuario desde detalle" });
      setPedido(prev => ({ ...prev, estado: "CANCELADO" }));
      alert("Pedido cancelado correctamente");
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cancelar el pedido");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner message="Cargando detalle..." />;
  if (!pedido) return <ErrorMessage msg={errorMessage || "Pedido no encontrado"} />;
  
  return (
    <Container className="mt-5 d-flex flex-column align-items-center">

    <div style={{alignSelf: 'flex-start', marginBottom: '1rem'}}>
        <Button variant="outline-secondary" onClick={() => navegar(-1)}>
            &larr; Volver
        </Button>
    </div>

      <Card style={{ maxWidth: '700px', width: '100%' }} className="p-4 shadow-sm">
        <Card.Title className="mb-3">Pedido #{pedido._id}</Card.Title>

        <Row className="mb-3">
          <Col><strong>Estado:</strong> <Badge bg={estadoColor(pedido.estado)}>{pedido.estado}</Badge></Col>
          <Col><strong>Fecha:</strong> {new Date(pedido.fechaCreacion).toLocaleDateString()}</Col>
          <Col><strong>Total:</strong> ${pedido.total}</Col>
        </Row>
        
         {pedido.estado !== "CANCELADO" && (
          <div className="mb-3">
            <Button variant="danger" onClick={handleCancelarPedido}>
              Cancelar Pedido
            </Button>
          </div>
        )}
    
        <h5>Items</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto ID</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map(item => (
              <tr key={item.productoId}>
                <td>{item.productoId}</td>
                <td>{item.cantidad}</td>
                <td>${item.precioUnitario}</td>
                <td>${item.precioUnitario * item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default DetallePedido;