
export default class DireccionEntrega {
  constructor({calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon}) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;
  }
}

//import DireccionEntrega from "./DireccionEntrega.js";

export class DireccionEntregaBuilder {
  constructor() {
    this.calle = "";
    this.altura = "";
    this.departamento = "";
    this.codigoPostal = "";
    this.ciudad = "";
    this.provincia = "";
    this.pais = "";
  }

  withCalle(calle) {
    this.calle = calle;
    return this;
  }

  withAltura(altura) {
    this.altura = altura;
    return this;
  }

  withDepartamento(departamento) {
    this.departamento = departamento;
    return this;
  }

  withCodigoPostal(codigoPostal) {
    this.codigoPostal = codigoPostal;
    return this;
  }

  withCiudad(ciudad) {
    this.ciudad = ciudad;
    return this;
  }

  withProvincia(provincia) {
    this.provincia = provincia;
    return this;
  }

  withPais(pais) {
    this.pais = pais;
    return this;
  }

  build() {
    return new DireccionEntrega({
      calle: this.calle,
      altura: this.altura,
      piso: this.piso,
      departamento: this.departamento,
      codigoPostal: this.codigoPostal,
      ciudad: this.ciudad,
      provincia: this.provincia,
      pais: this.pais,
      lat: this.lat,
      lon: this.lon
    });
  }
}
