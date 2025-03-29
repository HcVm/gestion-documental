// src/types/Producto.ts

export interface CatalogoElectronicoDTO {
    idCatalogo: number;
    codigoCatalogo: string;
    descripcionCatalogo: string;
  }
  
  export interface MarcaDTO {
    idMarca: number;
    nombreMarca: string;
  }
  
  export interface ValorCaracteristicaDTO {
    idValorCaracteristica: number;
    idCaracteristica: number;
    nombreCaracteristica: string;
    valor: string;
  }
  
  export interface ProductoDTO {
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    descripcionProducto: string;
    catalogoElectronico: CatalogoElectronicoDTO; // ✅ Mantiene la referencia correcta
    stock: number;
    estado: boolean;
    precioPlataforma: number;
    marca: MarcaDTO;
    caracteristicas?: ValorCaracteristicaDTO[];
  }
  
  