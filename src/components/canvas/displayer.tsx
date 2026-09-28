import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/react';

import { cn } from "@/lib/utils"
import { PlusIcon, TrashIcon, ArrowDownIcon, PencilIcon, LockIcon, UnlockIcon } from 'lucide-react'; // O cualquier ícono que prefieras

export function Display({ className, id, children }: React.ComponentProps<any>) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex-shrink-0 h-20 flex items-center justify-center text-xl font-bold border-b border-border">
                Creador de Moléculas
            </div>
            <div id={id} className="flex-1 overflow-y-auto p-6 bg-transparent">
                {children}
            </div>
            <div className="flex-shrink-0 flex items-center justify-center text-center h-20 border-t border-border">
                Footer
            </div>
        </div>
    );
}


export function GridCell({
    cell,
    onDelete,
    onEdit,
    onToggleLock
}: {
    cell: any;
    onDelete: (id: string, hasElement: boolean) => void;
    onEdit: (id: string) => void;
    onToggleLock: (id: string) => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    // Extraemos las propiedades de la celda para tener un código más limpio
    const isLocked = cell.props?.isLocked || false;
    const element = cell.element;
    const id = cell.id;
    // 1. Hook para recibir elementos (Deshabilitado si está bloqueada)
    const { ref: dropRef, isDropTarget } = useDroppable({
        id: id,
        disabled: isLocked // 🔴 dnd-kit evitará soltar cosas aquí automáticamente
    });

    // 2. Hook para arrastrar la celda (Deshabilitado si está bloqueada)
    const { ref: dragRef, isDragging } = useDraggable({
        id: `drag-${id}`,
        data: { type: 'cell-atom', sourceCellId: id },
        disabled: isLocked // 🔴 Evita que la celda se pueda arrastrar si tiene candado
    });

    // 3. Función CORRECTA para combinar ambas referencias en un solo div
    const setNodeRef = (node: HTMLElement | null) => {
        if (typeof dropRef === 'function') dropRef(node);
        else if (dropRef) (dropRef as any).current = node;

        if (typeof dragRef === 'function') dragRef(node);
        else if (dragRef) (dragRef as any).current = node;
    };

    return (
        <div
            ref={setNodeRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "relative flex-1 min-h-[70px] border-2 rounded-lg flex items-center justify-center p-2 transition-all",
                !isLocked ? "cursor-grab" : "cursor-not-allowed", // Cambia el cursor si está bloqueado
                isDropTarget && !isLocked ? "border-primary border-solid" : "border-border/50",
                element ? "border-solid bg-background" : "border-dashed opacity-70 hover:opacity-100",
                isDragging ? "opacity-40 scale-105 z-50 shadow-md" : ""
            )}
        >
            {/* Ícono de candado gigante de fondo (muy sutil) para indicar que no se toca */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <LockIcon size={40} />
                </div>
            )}

            {isHovered && (
                <div className="absolute -top-3 -right-3 flex gap-1 z-10 animate-in fade-in zoom-in-50 duration-150">

                    {/* Botón de Bloqueo / Desbloqueo (Este SIEMPRE aparece) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLock(id); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors",
                            isLocked ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                        )}
                        title={isLocked ? "Desbloquear celda" : "Bloquear celda"}
                    >
                        {isLocked ? <LockIcon size={12} /> : <UnlockIcon size={12} />}
                    </button>

                    {/* 🔴 Botón de Editar: SOLO aparece si NO está bloqueado y SÍ tiene elemento */}
                    {!isLocked && element && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(id); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-blue-600"
                            title="Editar propiedades"
                        >
                            <PencilIcon size={12} />
                        </button>
                    )}

                    {/* 🔴 Botón de Eliminar: SOLO aparece si NO está bloqueado */}
                    {!isLocked && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(id, !!element); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm cursor-pointer hover:bg-destructive/90"
                            title={element ? "Limpiar contenido" : "Eliminar columna"}
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

            {/* Contenedor del átomo */}
            <div className={cn("pointer-events-none w-full flex justify-center text-muted-foreground", isLocked && "opacity-60")}>
                {element ? element : <span className="text-xs">Celda vacía</span>}
            </div>
        </div>
    );
}



export function GridRow({
    row,
    onAddColumn,
    onRemoveRow,
    onInsertRowBelow, // 🔴 NUEVA PROPIEDAD
    children
}: {
    row: any,
    onAddColumn: (rowId: string) => void,
    onRemoveRow: (rowId: string) => void,
    onInsertRowBelow: (rowId: string, numCols: number) => void, // 🔴 TIPO DE LA FUNCIÓN
    children: React.ReactNode
}) {
    return (
        <div key={row.id} className="relative group border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
            <div className="flex flex-row gap-4">{children}</div>

            <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {/* Botón Agregar Columna (Horizontal) */}
                <button onClick={() => onAddColumn(row.id)} className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600" title="Agregar Columna a la derecha">
                    <PlusIcon size={14} />
                </button>

                {/* 🟢 NUEVO: Botón Insertar Fila Abajo (Vertical) */}
                <button
                    onClick={() => onInsertRowBelow(row.id, row.columns.length)}
                    className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-green-600"
                    title="Insertar fila abajo con la misma estructura"
                >
                    <ArrowDownIcon size={14} />
                </button>

                {/* Botón Eliminar Fila */}
                <button onClick={() => onRemoveRow(row.id)} className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-600" title="Eliminar Fila">
                    <TrashIcon size={14} />
                </button>
            </div>
        </div>
    )
}
export function MoleculeContainer({
    grid,
    onAddColumn,
    onRemoveRow,
    onInsertRowBelow,
    renderCell
}: {
    grid: any[],
    onAddColumn: (rowId: string) => void,
    onRemoveRow: (rowId: string) => void,
    onInsertRowBelow: (rowId: string, numCols: number) => void,
    renderCell: (col: any) => React.ReactNode
}) {
    // Estado independiente para la fila
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

    return (
        <div className="relative border-2 border-border rounded-xl p-4 shadow-sm bg-transparent">
            <div className="flex flex-col gap-3">
                {grid.map((row) => (
                    <div
                        key={row.id}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        className="relative flex flex-row gap-3 items-center"
                    >
                        {/* Contenedor de las celdas */}
                        <div className="flex flex-row gap-3 flex-1">
                            {row.columns.map((col: any) => renderCell(col))}
                        </div>

                        {/* Contenedor estático con altura fija (h-[70px]) que evita saltos y pérdidas de hover */}
                        <div className="w-8 h-[70px] flex flex-col justify-center items-center flex-shrink-0">
                            {hoveredRowId === row.id && (
                                <div className="flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                                    <button onClick={() => onAddColumn(row.id)} disabled={row.columns.length > 5} className="bg-primary text-primary-foreground w-6 h-6 rounded flex items-center justify-center hover:opacity-80 shadow-sm" title="Agregar columna">
                                        <PlusIcon size={14} />
                                    </button>
                                    <button onClick={() => onInsertRowBelow(row.id, row.columns.length)} disabled={grid.length > 7} className="bg-secondary text-secondary-foreground w-6 h-6 rounded flex items-center justify-center hover:opacity-80 border border-border shadow-sm" title="Insertar fila abajo">
                                        <ArrowDownIcon size={14} />
                                    </button>
                                    {grid.length > 1 && (
                                        <button onClick={() => onRemoveRow(row.id)} className="bg-destructive text-destructive-foreground w-6 h-6 rounded flex items-center justify-center hover:opacity-80 shadow-sm" title="Eliminar fila">
                                            <TrashIcon size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}






