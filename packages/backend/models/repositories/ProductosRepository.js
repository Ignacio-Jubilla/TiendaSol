import ProductoModel from "../schemas/ProductoModel.js";

export class ProductoRepository {
  async saveProducto(producto) {
    const productoNuevo = new ProductoModel(producto)
    console.log(productoNuevo)
    return await productoNuevo.save()
  }

  async findById(id) {
    return await ProductoModel.findById(id)
  }

  async getProductos(filtro, orden, page = 1, perPage = 30) {
    const total = await ProductoModel.countDocuments(filtro)
    const totalPages = Math.ceil(total / perPage)
    if (page > totalPages) {
      page = 1;
      perPage = 30;
    }
    const skipPages = (page - 1) * perPage;

    const aggregateFields = [
      { $match: filtro },
      {
        $lookup: {
          from: "itempedidos",
          localField: "_id",
          foreignField: "producto",
          as: "ventas"
        }
      },
      {
        $addFields: {
          totalVentas: { $ifNull: [{ $sum: "$ventas.cantidad" }, 0] }
        }
      }
    ]

    if (orden && Object.keys(orden).length > 0) aggregateFields.push({ $sort: orden })
    aggregateFields.push(
      { $skip: skipPages },
      { $limit: perPage },
      {
        $project: {
          ventas: 0,
          __v: 0
        }
      }
    )
    const productos = await ProductoModel.aggregate(aggregateFields)

    return {
      productos,
      page,
      perPage,
      total,
      totalPages
    };
  }

}