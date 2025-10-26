import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL
//modificar controller para agregar parametro activo
const getProductos = async (filtros = {}) => {
  const response = await axios.get(baseUrl + '/productos', {
    params: {...filtros, activo: true},
  })
  return response.data
}

const getProductosMasVendidos = async() => {
  const response = await axios.get(baseUrl + '/productos', {
    params: {perPage: 10, activo: true, ordenarPor: "VENTAS", orden: "DESC"},
  })
  return response.data
}

const getProducto = async(id) => {
  const response = await axios.get(baseUrl + `/productos/${id}`)
  return response.data
}


export default { getProductos, getProductosMasVendidos, getProducto }