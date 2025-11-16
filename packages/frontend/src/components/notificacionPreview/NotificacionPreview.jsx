import React, { useEffect, useState } from 'react'
import { Button, Popover } from 'react-bootstrap';
import { RiEyeLine } from "react-icons/ri";
import { useNotificacion } from '../../context/NotificacionContext';
import { useAuth } from '../../context/authContext';
import notificacionesService from '../../services/notificaciones'
import { Link, useNavigate } from 'react-router';
import { showSuccess } from '../../utils/confirmAction';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';

const NotificacionPreview = ({ onOpen, onClose, ...props }) => {

    const [notificacionesPopover, setNotificacionesPopover] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, getToken } = useAuth()
    const { restarNotificacion, notificaciones } = useNotificacion()
    
    
    const cargarNotificacionesPopUp = async () => {
        setLoading(true)
        if (user){
            const notis = await notificacionesService.getNotificaciones(false, 1, 3, getToken())
            setNotificacionesPopover(notis.data)
        }
        setLoading(false)
    }

    const marcarVisto = async (id) => {
        await notificacionesService.marcarNotificacionLeida(id, getToken())
        restarNotificacion()
    
        cargarNotificacionesPopUp()
    }

    useEffect(() => {
        cargarNotificacionesPopUp()
    }, [])

    
    return (
        <Popover
            id="popover-notificaciones" {...props} 
             onMouseEnter={onOpen} 
             onMouseLeave={onClose}
        >
        <Popover.Header as="h3">Notificaciones</Popover.Header>
        <Popover.Body>
            { /*loading ? 
                <p>Cargando notificaciones</p> :*/
                notificacionesPopover.length === 0 ? 
                <p>Todas las notificaciones han sido leídas</p> : (
                <><ul className="list-unstyled mb-0" style={{maxHeight: '15rem', overflowY: 'auto'}}>
                {notificacionesPopover.map((notificacion) => (
                    <li key={notificacion._id} className="d-flex flex-direction-column mb-2">
                    <div className='d-flex flex-direction-row justify-content between  w-100'>
                        <div className="ms-2">
                            {new Date(notificacion.fechaAlta).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="ms-2">
                            {notificacion.mensaje}
                        </div>
                        <Button variant='primary ms-5' onClick={async () => {
                            marcarVisto(notificacion._id)
                            showSuccess("Notificación marcada como vista");
                        }} >
                            <RiEyeLine size={20}/>
                        </Button>
                    </div>
                    </li>
                ))}
                </ul>
                <strong>Tiene {notificaciones} notificaciones sin leer</strong>
                <Button className='w-100 text-center' as={Link} to="/notificaciones">Ver notificaciones</Button></>
            ) }
        </Popover.Body>
        </Popover>
    )
}

export default NotificacionPreview
