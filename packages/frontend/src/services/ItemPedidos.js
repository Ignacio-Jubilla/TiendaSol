import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const obtenerItemsVendedor = async ({ vendedorId }) => {
  const token = localStorage.getItem("accessToken");

  const response = await axios.get(`${baseUrl}/itemPedidos?vendedorId=${vendedorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


const cambiarEstadoItemPedido = async (itemId, estado) => {
  const token = localStorage.getItem("accessToken")
  const response = await axios.patch(`${baseUrl}/itemPedidos/${itemId}?estado=${estado}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}



export default { obtenerItemsVendedor, cambiarEstadoItemPedido }