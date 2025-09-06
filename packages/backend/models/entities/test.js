import { Categoria } from "./Categoria.js";
import { TipoMoneda } from "./enums/TipoMoneda.js";
import { TipoUsuario } from "./enums/TipoUsuario.js";
import FactoryNotificacion from "./FactoryNotificacion.js"
import { ItemPedido } from "./ItemPedido.js";
import {Pedido} from "./Pedido.js"
import { Producto } from "./Producto.js";
import { Usuario } from "./Usuario.js";

const noti = new FactoryNotificacion("algo");

const categoria1 = new Categoria("nombreCategoria")

const comprador = new Usuario("pepe","pepe@gmail.com",12345678,TipoUsuario.COMPRADOR)

const vendedor = new Usuario("juan","juan@gmail.com",12345678,TipoUsuario.VENDEDOR)

const producto1 = new Producto(vendedor,"titulo producto","any description",categoria1,125,
    TipoMoneda.DOLAR_USA,4,"pathFotos");

const item1 = new ItemPedido(producto1,2,140);
const item2 = new ItemPedido(producto1,2,140);

const items = [];
items.push(item1);


const pedido = new Pedido();

// setear el pedido
pedido.setComprador(comprador);
pedido.agregarItem(item1);
pedido.agregarItem(item2);
pedido.setMoneda(TipoMoneda.DOLAR_USA);
pedido.setDireccionEntrega("Mozart 2300");

console.log(pedido.getItems())


const respuesta = noti.crearSegunPedido(pedido);

console.log(`Prueba de crearSegunPedido(pedido): \n`,respuesta);