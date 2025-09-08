export class DireccionEntrega {
  constructor(calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon) {
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
    this.numero = "";
    this.departamento = "";
    this.codigoPostal = "";
    this.localidad = "";
    this.provincia = "";
    this.pais = "";
  }

  withCalle(calle) {
    this.calle = calle;
    return this;
  }

  withNumero(numero) {
    this.numero = numero;
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

  withLocalidad(localidad) {
    this.localidad = localidad;
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
    return new DireccionEntrega(
      this.calle,
      this.numero,
      this.departamento,
      this.codigoPostal,
      this.localidad,
      this.provincia,
      this.pais
    );
  }
}
