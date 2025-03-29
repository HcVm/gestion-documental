import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Plus, Trash, Check } from "lucide-react";
import { useCaracteristicaStore } from "@/store/CaracteristicaStore";
import { useValorStore } from "@/store/ValorStore";

export default function GestionValores() {
  const { caracteristicas, obtenerCaracteristicas } = useCaracteristicaStore();
  const { valores, obtenerValores, crearValor, eliminarValor, cargando } = useValorStore();
  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState<{ idCaracteristica: number; nombreCaracteristica: string } | null>(null);
  const [nombreValor, setNombreValor] = useState("");
  const [open, setOpen] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    obtenerCaracteristicas();
    obtenerValores();
  }, [obtenerCaracteristicas, obtenerValores]);

  const handleAdd = async () => {
    if (caracteristicaSeleccionada && nombreValor.trim() !== "") {
      await crearValor({
        valor: nombreValor,
        idCaracteristica: caracteristicaSeleccionada.idCaracteristica,
        nombreCaracteristica: caracteristicaSeleccionada.nombreCaracteristica,
      });
      setNombreValor("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Valor</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-64 justify-between">
                {caracteristicaSeleccionada?.nombreCaracteristica ?? "Selecciona una característica"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command>
                <CommandInput placeholder="Buscar característica..." />
                <CommandEmpty>No se encontraron resultados</CommandEmpty>
                <CommandGroup>
                  {caracteristicas.map((caracteristica) => (
                    <CommandItem
                      key={caracteristica.idCaracteristica}
                      onSelect={() => {
                        setCaracteristicaSeleccionada({
                          idCaracteristica: caracteristica.idCaracteristica,
                          nombreCaracteristica: caracteristica.nombreCaracteristica ?? "", // Evita null en el nombre
                        });
                        setOpen(false);
                      }}
                      className="flex justify-between"
                    >
                      {caracteristica.nombreCaracteristica}
                      {caracteristicaSeleccionada?.idCaracteristica === caracteristica.idCaracteristica && <Check className="w-4 h-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Input placeholder="Nombre del valor" value={nombreValor} onChange={(e) => setNombreValor(e.target.value)} />

          <Button onClick={handleAdd} disabled={cargando || !caracteristicaSeleccionada}>
            <Plus className="mr-2 h-4 w-4" /> {cargando ? "Guardando..." : "Agregar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Valores</CardTitle>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : (
            <div className="space-y-6">
              {caracteristicas.map((caracteristica) => {
                const valoresFiltrados = valores.filter(
                  (valor) => valor.idCaracteristica === caracteristica.idCaracteristica
                );
                const mostrar = mostrarTodos[caracteristica.idCaracteristica];
                const valoresMostrados = mostrar ? valoresFiltrados : valoresFiltrados.slice(0, 2);

                return (
                  <div key={caracteristica.idCaracteristica}>
                    <h3 className="text-lg font-semibold mb-2">{caracteristica.nombreCaracteristica}</h3>
                    <Table className="table-fixed w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/12 text-center">ID</TableHead>
                          <TableHead className="w-1/6 text-center">Nombre</TableHead>
                          <TableHead className="w-1/4 text-center">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {valoresMostrados.length > 0 ? (
                          valoresMostrados.map((valor) => (
                            <TableRow key={valor.idValorCaracteristica}>
                              <TableCell className="text-center whitespace-nowrap">{valor.idValorCaracteristica}</TableCell>
                              <TableCell className="text-center whitespace-nowrap">{valor.valor}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => eliminarValor(valor.idValorCaracteristica)}
                                  disabled={cargando}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-gray-500">No hay valores registrados.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {valoresFiltrados.length > 2 && (
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => setMostrarTodos((prev) => ({
                          ...prev,
                          [caracteristica.idCaracteristica]: !mostrar,
                        }))}
                      >
                        {mostrar ? "Ver menos" : "Ver más"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
