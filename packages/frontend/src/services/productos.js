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

const getCategorias = async () => {
  const response = await axios.get(baseUrl + '/productos/categorias')
  return response.data
}

const postProducto = async (producto, imagenes) => {
  const formData = new FormData();
  producto.vendedorId = "690240d43a81a8c5c15ab2c4"

    formData.append("producto", JSON.stringify(producto));

    imagenes.forEach(imagenFile => {
      formData.append("imagenes", imagenFile);
    });
    try {
    const response = await axios.post(baseUrl + '/productos', formData, {
    });
    
    // 3. Devuelve los datos de la respuesta (el producto creado)
    return response.data
  } catch(err) {
  console.log(err)
  }
}

export default { getProductos, getProductosMasVendidos, getProducto, getCategorias, postProducto }