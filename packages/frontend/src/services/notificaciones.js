import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const getNotificaciones = async (leidas, page, limit, token) => {
  const response = await axios.get(baseUrl + '/notificaciones', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
        leidas: leidas,
        page: page,
        limit: limit
    },
  })
  return response.data
}

const marcarNotificacionLeida = async (id, token) => {
  const response = await axios.patch(baseUrl + `/notificaciones/${id}`,
    null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const contarNotificacionesNoLeidas = async (token) => {
  const response = await axios.get(baseUrl + `/notificaciones/no-leidas/cantidad`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export default {getNotificaciones, marcarNotificacionLeida, contarNotificacionesNoLeidas}