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
  async findAll() {
    return await ProductoModel.find({})
  }

  async getProductos(filtro, orden = {}) {

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
      },
      {
        $project: {
          ventas: 0,
          __v: 0
        }
      }
    ]      
  

if (Object.keys(orden).length > 0) {
  pipeline.push({ $sort: orden });
}


    const productos = await ProductoModel.aggregate(aggregateFields)
    await ProductoModel.populate(productos, { path: "vendedor", select: "_id nombre email"})
    return productos
  }

  update(id, updateData) {
    return ProductoModel.findByIdAndUpdate(id, updateData, { new: true })
  }
}