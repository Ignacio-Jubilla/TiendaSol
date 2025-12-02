import React from "react";
import { Button } from "react-bootstrap";
import './CardPedido.css'; // reutilizamos el CSS de CardPedido
import { showSuccess, showError, confirmAction } from "../../utils/confirmAction.js";

const CardItemPedido = ({ item, onEstadoCambiado }) => {
  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      const ok = await confirmAction({
        title: `¿Marcar como ${nuevoEstado}?`,
        text: `¿Seguro que querés poner este ítem en estado: ${nuevoEstado}?`,
        confirmText: "Sí, confirmar",
      });

      if (!ok) return;

      await onEstadoCambiado(item._id, nuevoEstado);

      showSuccess(`Estado actualizado a ${nuevoEstado}`);
    } catch (err) {
      console.error(err);
      showError("No se pudo cambiar el estado del ítem");
    }
  };

  return (
    <section className="card-pedido shadow-sm" key={item._id}>
      <div className="pedido-header d-flex justify-content-between align-items-center">
        <span className="pedido-id">Pedido {item.idPedido}</span>
        <span
          className={`badge-modern ${
            item.estado === "PENDIENTE"
              ? "text-warning"
              : item.estado === "ENVIADO"
              ? "text-success"
              : "text-danger"
          }`}
        >
          {item.estado}
        </span>
      </div>

      <p><strong>Producto:</strong> {item.producto?.titulo}</p>
      <p><strong>Cantidad:</strong> {item.cantidad}</p>
      <p><strong>Precio unitario:</strong> ${item.precioUnitario}</p>

      <div className="d-flex gap-2 justify-content-end mt-3">
        {item.estado === "PENDIENTE" && (
          <>
            <Button
              className="btn-modern btn-modern-primary"
              onClick={() => handleCambiarEstado("ENVIADO")}
            >
              Marcar como enviado
            </Button>

            <Button
              className="btn-modern btn-modern-danger"
              onClick={() => handleCambiarEstado("CANCELADO")}
            >
              Cancelar
            </Button>
          </>
        )}

        {item.estado !== "PENDIENTE" && (
          <p className="text-muted m-0">Este ítem ya fue gestionado.</p>
        )}
      </div>
    </section>
  );
};

export default CardItemPedido;
