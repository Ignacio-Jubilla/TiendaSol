import React, { useEffect, useState } from 'react'
import CardNotificaciones from '../../components/cards/CardNotificaciones'
import './Notificaciones.css'
import notificacionesService from '../../services/notificaciones';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import WarningMessage from '../../components/warningMessage/WarningMessage';
import ControlPaginado from '../../components/controlPaginado/ControlPaginado';
import { useSearchParams } from 'react-router';
import { Button } from 'react-bootstrap';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({})
  const [searchParams, setSearchParams] = useSearchParams({});
  const [notificacionesLeidas, setNotificacionesLeidas] = useState(false)

  const cargarNotificaciones = async ({pagina = 1, limit= 10, leidas= false}) => {
    try {
      setLoading(true)
      const usuario = "68d6cab39b8125b409b72c05"

      const notificacionesPage = await notificacionesService.getNotificaciones(usuario, leidas, pagina, limit)
      setNotificaciones(notificacionesPage.data)
      setSearchParams({usuario: usuario, page: notificacionesPage.pagina, leidas: notificacionesLeidas})
      setPagination({
        page: notificacionesPage.pagina,
        total_pages: notificacionesPage.totalPaginas
      })
    } catch(err) {
      setError("Hubo un error al intentar cargar las notificaciones. Intente nuevamente en unos minutos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarNotificaciones({})
  }, [])
  
  const marcarLeida = async (id) => {
    //const usuario = "68d6cab39b8125b409b72c05"
    await notificacionesService.marcarNotificacionLeida(id)

    cargarNotificaciones({})
    }

  const handleChangePage = (pag) => {
    cargarNotificaciones({pagina: pag, leidas: notificacionesLeidas})
  }

  const handleLeidasChange = (notiLeidas) => {
    setNotificacionesLeidas(notiLeidas)
  }

  useEffect(() => {
  cargarNotificaciones({ leidas: notificacionesLeidas });
  }, [notificacionesLeidas]);

  return (
    <div className="notificaciones">
      <Button variant="primary" onClick={() => handleLeidasChange(false)} disabled={!notificacionesLeidas}>No Leidas</Button>
      <Button variant="primary" onClick={() => handleLeidasChange(true)}  disabled={notificacionesLeidas}>Leidas</Button>
      {error ? <div className="cartelError"><ErrorMessage msg={error}/></div> : null}
      { loading ? 
          <LoadingSpinner message="Cargando notificaciones" /> :
          notificaciones.length === 0 && !error ?
          <div className="cartelError sinNotificaciones"><WarningMessage title={"Atencion"} msg={"No se encontraron notificaciones."} /> </div> :
        <div>
          <ControlPaginado onPageChange={handleChangePage} pagination={pagination}></ControlPaginado>
          <ul>
            {notificaciones.map(notificacion => (<li key={notificacion._id}> <CardNotificaciones notificacion={notificacion} marcarLeida={marcarLeida} /> </li>))}
          </ul>
        </div>

      } 
    </div>
  )
}

export default Notificaciones
