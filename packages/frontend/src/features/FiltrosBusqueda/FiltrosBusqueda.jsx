import React, { useState, useRef, useSyncExternalStore } from 'react';
import { Form, Button } from 'react-bootstrap';

const FiltrosBusqueda = ({ onSubmit, pagination}) => {
  const [filtros, setFiltros] = useState({});
  const [filtroActual, setFiltroActual] = useState(null);

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filtros.precioMin && filtros.precioMax) {
      if (Number(filtros.precioMin) >= Number(filtros.precioMax)) {
        alert("El precio mínimo no puede ser mayor que el precio máximo.");
        return;
      }
    }
    setFiltros({...filtros, page: 1})
    setFiltroActual({...filtros, page: 1})
    onSubmit({ ...filtros, page: 1 });
  };

  const handleChangePage = (page) => {
    // When changing page, use the previously applied filters
    setFiltroActual({...filtroActual, page: page})
    onSubmit({ ...filtroActual, page: page });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Control
        placeholder="Buscar..."
        name="valorBusqueda"
        value={filtros.valorBusqueda || ''}
        onChange={handleInputChange}
        className="mb-3"
      />
      <label>Rango de precios</label>
      <div className="d-flex flex-direction-row mb-3">
        <Form.Control
          type="number"
          min={0}
          placeholder="Precio min"
          name="precioMin"
          value={filtros.precioMin || ''}
          onChange={handleInputChange}
        />
        <Form.Control
          type="number"
          placeholder="Precio max"
          name="precioMax"
          value={filtros.precioMax || ''}
          onChange={handleInputChange}
        />
      </div>

      <label>Ordenar por</label>
      <Form.Select
        name="ordenarPor"
        value={filtros.ordenarPor || ''}
        onChange={handleInputChange}
        className="mb-2"
      >
        <option value="">Seleccionar</option>
        <option value="PRECIO">Precio</option>
        <option value="VENTAS">Ventas</option>
      </Form.Select>
      <Form.Select
        name="orden"
        value={filtros.orden || ''}
        onChange={handleInputChange}
        className="mb-3"
      >
        <option value="">Seleccionar</option>
        <option value="ASC">Ascendente</option>
        <option value="DESC">Descendente</option>
      </Form.Select>
      <label>Productos por pagina</label>
      <Form.Control
        type="number"
        min={1}
        max={30}
        placeholder="Productos por pagina"
        name="perPage"
        value={filtros.perPage || ''}
        onChange={handleInputChange}
        className="mb-3"
      />
      <Button type="submit" variant="dark" className="w-100 mb-4">
        Filtrar
      </Button>

      {/* --- Paginación --- */}
      {pagination && pagination.total_pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <Button
            variant="secondary"
            disabled={pagination.page === 1}
            onClick={() => handleChangePage(pagination.page - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <Button
            variant="secondary"
            disabled={pagination.page === pagination.total_pages}
            onClick={() => handleChangePage(pagination.page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </Form>
  );
};

export default FiltrosBusqueda;