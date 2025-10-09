import { v4 as uuidv4 } from 'uuid';

export class Producto{
    constructor(vendedor,titulo,descripcion,categorias,precio,moneda,stock,fotos){
        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio;
        this.moneda = moneda;
        this.stock = stock;
        this.ventas = 0;
        this.fotos = fotos;
        this.activo = true;
    }

    estaDisponible(cantidad){
        return cantidad<this.stock;
    }

    reducirStock(cantARestar){
        if(this.stock-cantARestar>=0){
            this.stock-=cantARestar;
            this.ventas += cantARestar;
        }else{
            throw new Error("No hay stock suficiente");
        }
    }

    aumentarStock(cantidad){
        this.stock+=cantidad;
    }

}