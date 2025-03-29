import { useEffect, useState } from "react";
import { useProductoStore } from "@/store/ProductoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogDescription, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Edit, Trash, List } from "lucide-react";
import { ProductoDTO } from "@/types/producto";
import { toast } from "sonner"
import ModalAgregarCaracteristica from "./AgregarCaracteristicaModal";

interface TablaProductosProps {
  idCatalogoSeleccionado: number | null;
  idMarcaSeleccionada: number | null;
}

const TablaProductos = ({ idCatalogoSeleccionado, idMarcaSeleccionada }: TablaProductosProps) => {
  const {
    productos,
    cargarProductosPorCatalogoYMarca,
    limpiarProductos,
    eliminarProducto,
    actualizarProducto,
    agregarCaracteristicasAProducto,
    eliminarCaracteristicaDeProducto
  } = useProductoStore();

  const [busqueda, setBusqueda] = useState<string>("");
  const [productoEditando, setProductoEditando] = useState<ProductoDTO | null>(null);
  const [modalEdicionAbierto, setModalEdicionAbierto] = useState<boolean>(false);
  const [productoParaCaracteristica, setProductoParaCaracteristica] = useState<ProductoDTO | null>(null);
  const [modalCaracteristicaAbierto, setModalCaracteristicaAbierto] = useState<boolean>(false);
  const [productoVerCaracteristicas, setProductoVerCaracteristicas] = useState<ProductoDTO | null>(null);
  const [modalVerCaracteristicasAbierto, setModalVerCaracteristicasAbierto] = useState<boolean>(false);
  const [productoAEliminar, setProductoAEliminar] = useState<ProductoDTO | null>(null);
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState<boolean>(false);
  const [caracteristicaAEliminar, setCaracteristicaAEliminar] = useState<{ idProducto: number, idValorCaracteristica: number } | null>(null);
  const [dialogoEliminarCaracteristicaAbierto, setDialogoEliminarCaracteristicaAbierto] = useState<boolean>(false);

  useEffect(() => {
    if (idCatalogoSeleccionado) {
      cargarProductosPorCatalogoYMarca(idCatalogoSeleccionado, idMarcaSeleccionada);
    } else {
      limpiarProductos();
    }
  }, [idCatalogoSeleccionado, idMarcaSeleccionada, cargarProductosPorCatalogoYMarca, limpiarProductos]);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.codigoProducto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalEdicion = (producto: ProductoDTO) => {
    setProductoEditando({ ...producto });
    setModalEdicionAbierto(true);
  };

  const cerrarModalEdicion = () => {
    setModalEdicionAbierto(false);
    setProductoEditando(null);
  };

  const abrirModalAgregarCaracteristica = (producto: ProductoDTO) => {
    setProductoParaCaracteristica(producto);
    setModalCaracteristicaAbierto(true);
  };

  const cerrarModalAgregarCaracteristica = () => {
    setProductoParaCaracteristica(null);
    setModalCaracteristicaAbierto(false);
  };

  const abrirModalVerCaracteristicas = (producto: ProductoDTO) => {
    setProductoVerCaracteristicas(producto);
    setModalVerCaracteristicasAbierto(true);
  };

  const cerrarModalVerCaracteristicas = () => {
    setProductoVerCaracteristicas(null);
    setModalVerCaracteristicasAbierto(false);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (productoEditando) {
      setProductoEditando({
        ...productoEditando,
        [name]: name === "stock" || name === "precioPlataforma" ? Number(value) : value,
      });
    }
  };

  const guardarCambios = async () => {
    if (!productoEditando?.idProducto) {
      console.error("Error: El producto no tiene un ID válido.");
      return;
    }

    await actualizarProducto(productoEditando.idProducto, productoEditando);
    cerrarModalEdicion();
  };

  const abrirDialogoEliminarCaracteristica = (idProducto: number, idValorCaracteristica: number) => {
    setCaracteristicaAEliminar({ idProducto, idValorCaracteristica });
    setDialogoEliminarCaracteristicaAbierto(true);
  };

  const cerrarDialogoEliminarCaracteristica = () => {
    setDialogoEliminarCaracteristicaAbierto(false);
    setCaracteristicaAEliminar(null);
  };

  const confirmarEliminarCaracteristica = async () => {
    if (caracteristicaAEliminar) {
      await eliminarCaracteristicaDeProducto(caracteristicaAEliminar.idProducto, caracteristicaAEliminar.idValorCaracteristica);

      if (productoVerCaracteristicas) {
        setProductoVerCaracteristicas({
          ...productoVerCaracteristicas,
          caracteristicas: productoVerCaracteristicas.caracteristicas?.filter(
            (c) => c.idValorCaracteristica !== caracteristicaAEliminar.idValorCaracteristica
          ),
        });
      }
      toast.success("Característica eliminada correctamente");
    }
    cerrarDialogoEliminarCaracteristica();
  };

  const abrirDialogoEliminar = (producto: ProductoDTO) => {
    setProductoAEliminar(producto);
    setDialogoEliminarAbierto(true);
  };

  const cerrarDialogoEliminar = () => {
    setDialogoEliminarAbierto(false);
    setProductoAEliminar(null);
  };

  const confirmarEliminarProducto = async () => {
    if (productoAEliminar?.idProducto) {
      await eliminarProducto(productoAEliminar.idProducto);
      toast.success("Producto eliminado correctamente");
    }
    cerrarDialogoEliminar();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>

      <Input
        type="text"
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 w-100"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <TableRow key={producto.idProducto}>
                <TableCell>{producto.codigoProducto}</TableCell>
                <TableCell>{producto.nombreProducto}</TableCell>
                <TableCell>{producto.marca ? producto.marca.nombreMarca : "Sin marca"}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>S/. {producto.precioPlataforma ? producto.precioPlataforma.toFixed(2) : "0.00"}</TableCell>
                <TableCell>{producto.estado ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => abrirModalVerCaracteristicas(producto)}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => abrirModalAgregarCaracteristica(producto)}>
                      ➕
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => abrirModalEdicion(producto)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => abrirDialogoEliminar(producto)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No hay productos disponibles.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* MODAL DE EDICIÓN */}
      <Dialog open={modalEdicionAbierto} onOpenChange={cerrarModalEdicion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>

          {productoEditando && (
            <div className="grid gap-4">
              <Input name="codigoProducto" value={productoEditando.codigoProducto} onChange={manejarCambio} disabled />
              <Input name="nombreProducto" value={productoEditando.nombreProducto} onChange={manejarCambio} />
              <Input name="stock" type="number" value={productoEditando.stock} onChange={manejarCambio} />
              <Input
                name="precioPlataforma"
                type="number"
                step="0.01"
                value={productoEditando.precioPlataforma}
                onChange={manejarCambio}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={cerrarModalEdicion}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL DE AGREGAR CARACTERÍSTICA */}
      {productoParaCaracteristica && (
        <ModalAgregarCaracteristica
          producto={productoParaCaracteristica}
          isOpen={modalCaracteristicaAbierto}
          onClose={cerrarModalAgregarCaracteristica}
          onAgregarCaracteristica={(caracteristica, valor) => {
            console.log("Agregando característica:", caracteristica);
            console.log("Agregando valor:", valor);

            if (productoParaCaracteristica?.idProducto) {
              agregarCaracteristicasAProducto(
                productoParaCaracteristica.idProducto,
                [valor.idValorCaracteristica]
              );
              cerrarModalAgregarCaracteristica();
            }
          }}
        />
      )}

      <Dialog open={modalVerCaracteristicasAbierto} onOpenChange={cerrarModalVerCaracteristicas}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Características del Producto</DialogTitle>
            <DialogDescription>
              {productoVerCaracteristicas?.nombreProducto} ({productoVerCaracteristicas?.codigoProducto})
            </DialogDescription>
          </DialogHeader>
          {productoVerCaracteristicas?.caracteristicas &&
            productoVerCaracteristicas.caracteristicas.length > 0 ? (
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Característica</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productoVerCaracteristicas.caracteristicas.map((valorCaract) => (
                      <TableRow key={valorCaract.idValorCaracteristica}>
                        <TableCell>{valorCaract.nombreCaracteristica}</TableCell>
                        <TableCell>{valorCaract.valor}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => abrirDialogoEliminarCaracteristica(
                              productoVerCaracteristicas.idProducto!,
                              valorCaract.idValorCaracteristica!
                            )}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-2 text-gray-500">Este producto no tiene características asignadas.</p>
            )}
          <DialogFooter>
            <Button onClick={cerrarModalVerCaracteristicas}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={dialogoEliminarCaracteristicaAbierto} onOpenChange={cerrarDialogoEliminarCaracteristica}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Característica?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar esta característica? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cerrarDialogoEliminarCaracteristica}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminarCaracteristica}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <AlertDialog open={dialogoEliminarAbierto} onOpenChange={cerrarDialogoEliminar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cerrarDialogoEliminar}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminarProducto}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TablaProductos;