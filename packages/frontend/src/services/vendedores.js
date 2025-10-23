import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const getVendedores = async (filtros = {}) => {
  const response = await axios.get(baseUrl + '/usuarios/vendedores', {
    params: filtros,
  })
  return response.data
}

export default getVendedores 