import { create } from "zustand";
import { ProductoService } from "../services/productoService";
import { ProductoDTO } from "@/types/producto";

interface ProductoState {
  productos: ProductoDTO[];
  productoSeleccionado: ProductoDTO | null;
  cargarProductosPorCatalogo: (idCatalogo: number) => Promise<void>;
  cargarProductosPorMarca: (idMarca: number) => Promise<void>;
  cargarProductosPorCatalogoYMarca: (idCatalogo: number, idMarca: number | null) => Promise<void>;
  limpiarProductos: () => void;
  eliminarProducto: (id: number) => Promise<void>;
  seleccionarProducto: (producto: ProductoDTO | null) => void;
  actualizarProducto: (idProducto: number, productoActualizado: ProductoDTO) => Promise<void>;
  agregarCaracteristicasAProducto: (idProducto: number, idsCaracteristicas: number[]) => Promise<void>;
  eliminarCaracteristicaDeProducto: (idProducto: number, idCaracteristica: number) => Promise<void>;
}

export const useProductoStore = create<ProductoState>((set) => ({
  productos: [],
  productoSeleccionado: null,

  cargarProductosPorCatalogo: async (idCatalogo: number) => {
    console.log("🔍 Cargando productos para catálogo ID:", idCatalogo);
    const productos = await ProductoService.obtenerProductosPorCatalogo(idCatalogo);
    console.log("✅ Productos recibidos:", productos);
    set({ productos });
  },

  cargarProductosPorMarca: async (idMarca: number) => {
    console.log("🔍 Cargando productos para marca ID:", idMarca);
    const productos = await ProductoService.obtenerProductosPorMarca(idMarca);
    console.log("✅ Productos recibidos:", productos);
    set({ productos });
  },

  cargarProductosPorCatalogoYMarca: async (idCatalogo, idMarca) => {
    let productos = [];
    if (idMarca) {
      productos = await ProductoService.obtenerProductosPorCatalogoYMarca(idCatalogo, idMarca);
    } else {
      productos = await ProductoService.obtenerProductosPorCatalogo(idCatalogo);
    }
    set({ productos });
  },

  limpiarProductos: () => {
    set({ productos: [] });
  },

  eliminarProducto: async (id) => {
    await ProductoService.eliminarProducto(id);
    set((state) => ({ productos: state.productos.filter((p) => p.idProducto !== id) }));
  },

  seleccionarProducto: (producto) => set({ productoSeleccionado: producto }),

  actualizarProducto: async (idProducto: number, productoActualizado: ProductoDTO) => {
    if (!idProducto) {
        console.error("Error: El ID del producto no es válido.");
        return;
    }
    await ProductoService.actualizarProducto(idProducto, productoActualizado);
    set((state) => ({
      productos: state.productos.map((p) =>
        p.idProducto === idProducto ? productoActualizado : p
      ),
    }));
  },

  agregarCaracteristicasAProducto: async (idProducto: number, idsCaracteristicas: number[]) => {
    try {
      console.log("🔍 Agregando características al producto ID:", idProducto, idsCaracteristicas);
      const productoActualizado = await ProductoService.agregarCaracteristicasAProducto(idProducto, idsCaracteristicas);
      console.log("✅ Producto actualizado:", productoActualizado);
      set((state) => ({
        productos: state.productos.map((p) =>
          p.idProducto === idProducto ? productoActualizado : p
        ),
        productoSeleccionado: state.productoSeleccionado?.idProducto === idProducto ? productoActualizado : state.productoSeleccionado,
      }));
    } catch (error) {
      console.error("❌ Error al agregar características al producto:", error);
    }
  },

  eliminarCaracteristicaDeProducto: async (idProducto: number, idCaracteristica: number) => {
    try {
      const productoActualizado = await ProductoService.eliminarCaracteristicaDeProducto(idProducto, idCaracteristica);
      set((state) => ({
        productos: state.productos.map((p) =>
          p.idProducto === idProducto ? productoActualizado : p
        ),
        productoSeleccionado: state.productoSeleccionado?.idProducto === idProducto ? productoActualizado : state.productoSeleccionado,
      }));
    } catch (error) {
      console.error("Error al eliminar característica del producto:", error);
    }
  },
}));