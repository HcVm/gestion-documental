import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, Plus } from "lucide-react";
import { useCaracteristicaStore } from "@/store/CaracteristicaStore";
import { useValorStore } from "@/store/ValorStore";
import { toast } from "sonner";
import { ProductoDTO } from "@/types/producto";

interface ModalProps {
  producto: ProductoDTO;
  isOpen: boolean;
  onClose: () => void;
  onAgregarCaracteristica: (
    caracteristica: { idCaracteristica: number; nombreCaracteristica: string },
    valor: { idValorCaracteristica: number; valor: string }
  ) => void;
}

export default function ModalAgregarCaracteristica({ producto, isOpen, onClose, onAgregarCaracteristica }: ModalProps) {
  const { caracteristicas, obtenerCaracteristicas } = useCaracteristicaStore();
  const { valores, obtenerValores } = useValorStore();

  const [caracteristicaSeleccionada, setCaracteristicaSeleccionada] = useState<{ idCaracteristica: number; nombreCaracteristica: string } | null>(null);
  const [valorSeleccionado, setValorSeleccionado] = useState<{ idValorCaracteristica: number; valor: string } | null>(null);
  const [openCaracteristica, setOpenCaracteristica] = useState(false);
  const [openValor, setOpenValor] = useState(false);

  useEffect(() => {
    obtenerCaracteristicas();
    obtenerValores();
  }, [obtenerCaracteristicas, obtenerValores]);

  const valoresFiltrados = caracteristicaSeleccionada
    ? valores.filter((valor) => valor.idCaracteristica === caracteristicaSeleccionada.idCaracteristica)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Característica a {producto.nombreProducto}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selección de característica */}
          <Popover open={openCaracteristica} onOpenChange={setOpenCaracteristica}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
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
                          nombreCaracteristica: caracteristica.nombreCaracteristica ?? "",
                        });

                        setValorSeleccionado(null); 
                        setOpenCaracteristica(false);
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

          {/* Selección de valor */}
          <Popover open={openValor} onOpenChange={setOpenValor}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full" disabled={!caracteristicaSeleccionada}>
                {valorSeleccionado?.valor ?? "Selecciona un valor"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command>
                <CommandInput placeholder="Buscar valor..." />
                <CommandEmpty>No hay valores para esta característica</CommandEmpty>
                <CommandGroup>
                  {valoresFiltrados.map((valor) => (
                    <CommandItem
                      key={valor.idValorCaracteristica}
                      onSelect={() => {
                        setValorSeleccionado(valor);
                        setOpenValor(false);
                      }}
                      className="flex justify-between"
                    >
                      {valor.valor}
                      {valorSeleccionado?.idValorCaracteristica === valor.idValorCaracteristica && <Check className="w-4 h-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botones de acción */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (caracteristicaSeleccionada && valorSeleccionado) {
                onAgregarCaracteristica(caracteristicaSeleccionada, valorSeleccionado);
                setCaracteristicaSeleccionada(null);
                setValorSeleccionado(null);
                onClose();

                toast.success(`Se agregó ${caracteristicaSeleccionada.nombreCaracteristica} : ${valorSeleccionado.valor} a ${producto.nombreProducto}`);
              }
            }}
            disabled={!caracteristicaSeleccionada || !valorSeleccionado}
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
