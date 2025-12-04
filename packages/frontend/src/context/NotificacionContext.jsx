import React, { createContext, useState, useContext, useEffect } from 'react';
import notificacionesService from '../services/notificaciones'
import { useAuth } from './authContext';

const NotificacionContext = createContext();

export const useNotificacion = () => {
  return useContext(NotificacionContext);
};

export const NotificacionProvider = ({ children }) => {

    const { user, getToken } = useAuth()

    const [notificaciones, setNotificaciones] = useState()

    const cargarNotificaciones = async () => {
        if (user){
            const cantidadNotificaciones = await notificacionesService.contarNotificacionesNoLeidas(getToken())
            setNotificaciones(cantidadNotificaciones.cantidad)
        }
    }

    const restarNotificacion = () => {
        setNotificaciones(prev => Math.max(0, prev - 1))
    }

    useEffect(() => {
        cargarNotificaciones()
        }, [user])
    

    const value = {
        notificaciones,
        restarNotificacion
    };

    return (
        <NotificacionContext.Provider value={value}>
        {children}
        </NotificacionContext.Provider>
    );
};