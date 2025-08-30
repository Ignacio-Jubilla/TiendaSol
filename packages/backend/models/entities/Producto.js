
import { v4 as uuidv4 } from 'uuid';


export default class Producto{
    constructor(vendedor,titulo,descripcion,categorias,precio,moneda,stock,fotos){
        this.id= uuidv4();
        this.vendedor = vendedor;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categorias = categorias;
        this.precio = precio
        this.moneda = moneda;
        this.stock = stock
        this.fotos = fotos
        this.activo = true;
        
    }

    estaDisponible(cantidad){
        if(cantidad<this.stock){
            return true;
        }else{
            return false;
        }
    }

    reducirStock(cantARestar){
        if(this.stock-cantARestar>=0){
            this.stock-=cantARestar;
        }else{
            this.stock=0;
            console.log("SIN STOCK: no se puede reducir más, la cantidad a reducir se excede por ${cant}",Math.abs(this.stock-cantARestar));
        }
    }

    aumentarStock(cantidad){
        this.stock+=cantidad;
    }

}