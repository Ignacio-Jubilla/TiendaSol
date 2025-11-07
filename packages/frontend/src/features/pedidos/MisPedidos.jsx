import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import CardPedido from '../../components/cards/CardPedido';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import ControlPaginado from '../../components/controlPaginado/ControlPaginado';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

import pedidosMock from '../../mocks/pedidos.json'


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

const MisPedidos = ({ usuarioId }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [pagination, setPagination] = useState(pedidosMock.pagination);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      // Pedidos de la página 1
      const pageSize = pagination.porPagina || 5;
      const pedidosPagina = pedidosMock.data.slice(0, pageSize);

      setPedidos(pedidosPagina);
      setPagination(prev => ({
        ...prev,
        page: 1
      }));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [usuarioId]);

  const handleChangePage = (page) => {
    setLoading(true);

    const pageSize = pagination.porPagina || 5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const pedidosPagina = pedidosMock.data.slice(start, end);

    // Simula retardo de API
    setTimeout(() => {
      setPedidos(pedidosPagina);
      setPagination(prev => ({ ...prev, page }));
      setLoading(false);
    }, 500);
  };

  return (
    <Container className="mt-4">
      <ErrorMessage msg={errorMessage} />
      <Row>
        <Col xs={12}>
          {loading ? (
            <LoadingSpinner message="Cargando pedidos..." />
          ) : pedidos.length === 0 ? (
            <p>No tenés pedidos aún.</p>
          ) : (
            pedidos.map(pedido => <CardPedido 
                key={pedido._id} 
                pedido={pedido}
                onPedidoCancelado={(pedidoId) => {
                    setPedidos(prev => prev.map(p => p._id === pedidoId ? {...p, estado: "CANCELADO"} : p));
                }}
                >
                    <Badge bg={estadoColor(pedido.estado)} className="ms-2">
                        {pedido.estado}
                    </Badge>
                </CardPedido>
            )
          )}
        </Col>
      </Row>

      {pedidos.length > 0 && (
        <Row className="mt-3">
          <Col xs={12}>
            <ControlPaginado onPageChange={handleChangePage} pagination={pagination} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MisPedidos;
