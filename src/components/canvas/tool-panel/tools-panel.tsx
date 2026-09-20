import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Draggable } from "./tools-panel-utils"
import { AtomIcon, GripVertical } from "lucide-react";
export function ToolsPanel({
    className,
    draggableItems
}: React.ComponentProps<any>) {
    return (
        // Contenedor principal: Quitamos los bordes sólidos y usamos el color de fondo y texto del tema
        <div className={cn("flex flex-col h-full bg-background border-r border-border", className)}>

            {/* HEADER: Altura de 20 (igual que el Displayer) para que se alineen visualmente */}
            <div className="flex-shrink-0 h-20 px-6 flex items-center border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <AtomIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">Átomos</h2>
                </div>
            </div>

            {/* BODY: Zona scrollable con espaciado uniforme */}
            <div className="flex-1 overflow-y-auto p-2">


                {/* Contenedor de los items arrastrables */}
                <div className="flex flex-col gap-3">
                    {draggableItems.map((drg: any, index: any) => (
                        // Envolvemos sutilmente cada item para darle un contexto de "arrastrable" en el panel
                        <div key={index} className="relative group/tool">
                            {/* Icono de arrastre que aparece sutilmente */}
                            <div className="w-full">
                                {drg}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER: Reemplazamos "Body Item 1" por un tip útil para el usuario */}
            <div className="flex-shrink-0 p-4 border-t border-border bg-muted/30">
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    Arrastra los átomos hacia el lienzo para construir tu molécula.
                </p>
            </div>

        </div>
    );
}