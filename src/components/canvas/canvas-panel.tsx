import React, { act, useState } from 'react';
import { cn } from "@/lib/utils"
import { Display, GridCell, GridRow, MoleculeContainer } from "./displayer"
import { ToolsPanel } from "./tool-panel/tools-panel"
import { DragDropProvider } from '@dnd-kit/react';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { Plus, PlusIcon, TrashIcon, SaveIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogAtom } from "./Dialog/DialogAtom"

import { Draggable, Sortable, SortableItem } from './tool-panel/tools-panel-utils';
import { Button, ButtonCustom } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DialogDemo } from '../ui/dialog'
type CellData = { id: string; element: React.ReactNode | null; props?: { isLocked?: boolean;[key: string]: any } };
type RowData = { id: string; columns: CellData[] };

const generateId = () => Math.random().toString(36).substring(2, 9);

function arrayMove<T>(array: T[], from: number, to: number): T[] {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
}
export function CanvasPanel({
    className
}: React.ComponentProps<"div">) {
    const [moleculeName, setMoleculeName] = useState("");
    const [elementToEdit, setElementToEdit] = useState<any>();


    const [grid, setGrid] = useState<RowData[]>([
        { id: `row-${generateId()}`, columns: [{ id: `cell-${generateId()}`, element: null }] }
    ]);
    const dggItems = [
        <Draggable id="btn-id" key="btn-id">
            <div className={cn("flex items-center justify-center rounded-sm h-8 border bg")}>
                <Button size={"sm"} className={cn("")}>Button</Button>
            </div>

        </Draggable>,
        <Draggable id="btnc-id" ctype="button" key="btnc-id">
            <ButtonCustom />
        </Draggable>,
        <Draggable id="lbl-id" ctype="label" key="lbl-id">
            <div className={cn("content-center rounded-sm justify-items-center h-8 border bg")}>
                <Label>Label</Label>
            </div>
        </Draggable>,
        <Draggable id="ipt-id" ctype="input" key="ipt-id">
            <div className={cn("rounded-sm h-8")}>
                <Input
                    className={cn("h-full text-center rounded-sm bg-transparent")}
                    placeholder="Input" disabled />
            </div>
        </Draggable>,
        <Draggable id="dlg-id" key={"dlg-id"}>
            <div className={cn("flex items-center justify-center rounded-sm h-8 border bg")}>

                <DialogDemo></DialogDemo>
            </div>

        </Draggable>

    ];

    const [elementsList] = useState<any>(dggItems);
    const addRow = () => {
        const newRow: RowData = {
            id: `row-${generateId()}`,
            columns: [{ id: `cell-${generateId()}`, element: null }]
        };
        setGrid([...grid, newRow]);
    };
    const addColumnToRow = (rowId: string) => {
        setGrid(grid.map(row => {
            if (row.id === rowId) {
                const newColumn: CellData = { id: `cell-${generateId()}`, element: null };
                return { ...row, columns: [...row.columns, newColumn] };
            }
            return row;
        }));
    };
    const handleEditCell = (cellId: string) => {
        // Buscamos si la celda ya tiene metadata guardada
        grid.forEach(row => {
            row.columns.forEach(col => {
                if (col.id === cellId && col.element) {
                    console.log('col element', col.element)
                    setElementToEdit(col);
                }
            });
        });

    };
    const handleSaveMolecule = (status: 'draft' | 'published') => {
        const serializedGrid = grid.map(row => ({
            rowId: row.id,
            columns: row.columns.map(col => {
                let elementType = 'empty';
                if (col.element && (col.element as any).props?.id) {
                    elementType = String((col.element as any).props.id).split('-')[0];
                }
                return { cellId: col.id, type: elementType, props: col.props };
            })
        }));

        // Validamos si el usuario dejó el campo vacío
        const finalName = moleculeName.trim() === "" ? "Molécula sin nombre" : moleculeName;

        const payload = {
            moleculeName: finalName, // Usamos el estado aquí
            status: status,          // Agregamos si es draft o published
            layout: serializedGrid,
            createdAt: new Date().toISOString()
        };

        console.log(`Molécula guardada (${status}):`, JSON.stringify(payload, null, 2));
    };

    const removeRow = (rowId: string) => {
        setGrid(prevGrid => prevGrid.filter(row => row.id !== rowId));
    };
    const handleDeleteCell = (cellId: string, hasElement: boolean) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => {
                if (hasElement) {
                    return {
                        ...row,
                        columns: row.columns.map(col => col.id === cellId ? { ...col, element: null } : col)
                    };
                } else {
                    return {
                        ...row,
                        columns: row.columns.filter(col => col.id !== cellId)
                    };
                }
            });

            // Si al eliminar una celda, la fila se queda vacía, la eliminamos también del grid
            return newGrid.filter(row => row.columns.length > 0);
        });
    };
    const insertRowBelow = (rowId: string, numColumns: number) => {
        setGrid(prevGrid => {
            // 1. Buscamos en qué posición está la fila actual
            const rowIndex = prevGrid.findIndex(row => row.id === rowId);
            if (rowIndex === -1) return prevGrid;

            // 2. Creamos la cantidad exacta de celdas vacías que tiene la fila superior
            const newColumns = Array.from({ length: numColumns }).map(() => ({
                id: `cell-${generateId()}`,
                element: null
            }));

            const newRow = {
                id: `row-${generateId()}`,
                columns: newColumns
            };

            // 3. Insertamos la nueva fila justo en el índice siguiente (abajo)
            const newGrid = [...prevGrid];
            newGrid.splice(rowIndex + 1, 0, newRow);
            return newGrid;
        });
    };
    const handleDragEnd = (event: any) => {
        const active = event.operation?.source || event.active;
        const over = event.operation?.target || event.over;

        if (event.canceled || !over) return;
        let targetCellIsLocked = false;
        grid.forEach(row => {
            row.columns.forEach(col => {
                if (col.id === over.id && col.props?.isLocked) {
                    targetCellIsLocked = true;
                }
            });
        });
        if (targetCellIsLocked) {
            console.log("DROP RECHAZADO: La celda de destino está bloqueada.");
            return;
        }
        const activeId = active?.id;
        const overId = over?.id;
        const activeData = active?.data?.current || (event.operation?.source?.data);

        // 🟢 CASO 1: MOVER DE CELDA A CELDA (INTERCAMBIO / SWAP)
        if (activeData?.type === 'cell-atom') {
            const sourceCellId = activeData.sourceCellId;

            if (sourceCellId === overId) return; // Si lo suelta en el mismo lugar, no hacemos nada

            setGrid(prevGrid => {
                let sourceElement: React.ReactNode = null;
                let targetElement: React.ReactNode = null;

                // Paso A: Encontramos qué elemento hay en el Origen y qué hay en el Destino
                prevGrid.forEach(row => {
                    row.columns.forEach(col => {
                        if (col.id === sourceCellId) sourceElement = col.element;
                        if (col.id === overId) targetElement = col.element;
                    });
                });

                // Paso B: Retornamos el grid intercambiando los elementos
                return prevGrid.map(row => ({
                    ...row,
                    columns: row.columns.map(col => {
                        // A la celda original le asignamos lo que había en el destino
                        if (col.id === sourceCellId) {
                            return { ...col, element: targetElement };
                        }
                        // A la celda de destino le asignamos el átomo que venimos arrastrando
                        if (col.id === overId) {
                            return { ...col, element: sourceElement };
                        }
                        return col;
                    })
                }));
            });
            return; // Terminamos la ejecución aquí
        }

        // 🔵 CASO 2: AGREGAR NUEVO ELEMENTO DESDE EL PANEL DE HERRAMIENTAS
        if (String(overId).startsWith('cell-')) {
            const originalElement = elementsList.find((el: any) => el.props.id === activeId);

            if (originalElement) {
                const newId = `${activeId}-${Date.now()}`;
                //const componenetType = 
                const newElement = React.cloneElement(originalElement.props.children, { id: newId, ctype: originalElement.props.ctype });

                setGrid(prevGrid => prevGrid.map(row => ({
                    ...row,
                    columns: row.columns.map(col =>
                        // Si arrastramos una herramienta nueva a una celda ocupada, reemplaza el contenido
                        col.id === overId ? { ...col, element: newElement } : col
                    )
                })));
            }
        }
    };
    const handleToggleLock = (cellId: string) => {
        setGrid(prevGrid => prevGrid.map(row => ({
            ...row,
            columns: row.columns.map(col => {
                if (col.id === cellId) {
                    return {
                        ...col,
                        props: {
                            ...col.props,
                            isLocked: !col.props?.isLocked
                        }
                    };
                }
                return col;
            })
        })));
    };
    return (
        <div className="flex flex-row h-screen">
            <DragDropProvider onDragEnd={handleDragEnd} modifiers={[RestrictToWindow]}>
                <div className={cn("basis-1/8")}>
                    <ToolsPanel draggableItems={elementsList} />
                </div>
                <div className={cn("basis-7/8 w-full")}>
                    <Display id="MainDisplayer">

                        <div className="flex justify-between items-center mb-6 gap-3">
                            <Input
                                className={cn("flex justify-between  text-center rounded-sm bg-transparent")}
                                placeholder="Inserta nombre de molécula"
                                value={moleculeName}
                                onChange={(e) => setMoleculeName(e.target.value)} />
                            <div className="flex gap-3">

                                <Button onClick={() => handleSaveMolecule("published")} variant="secondary" className="border border-border">
                                    <SaveIcon size={16} className="mr-2" /> Publicar Molécula
                                </Button>
                                <Button onClick={() => handleSaveMolecule("draft")} variant="secondary" className="border border-border">
                                    <SaveIcon size={16} className="mr-2" /> Guardar Draft
                                </Button>
                                <Button onClick={addRow}>
                                    <PlusIcon size={16} className="mr-2" /> Agregar Fila
                                </Button>
                            </div>
                        </div>

                        {grid.length > 0 ? (
                            <MoleculeContainer
                                grid={grid}
                                onAddColumn={addColumnToRow}
                                onRemoveRow={removeRow}
                                onInsertRowBelow={insertRowBelow}
                                renderCell={(col) => (
                                    <GridCell
                                        key={col.id}
                                        cell={col} // Pasamos el objeto completo
                                        onDelete={handleDeleteCell}
                                        onEdit={handleEditCell}
                                        onToggleLock={handleToggleLock} // Pasamos la nueva función
                                    />
                                )}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl opacity-60">
                                <p className="mb-4">No hay elementos en esta molécula.</p>
                                <Button onClick={addRow} variant="outline">Comenzar a construir</Button>
                            </div>
                        )}

                    </Display>
                </div>
            </DragDropProvider>
            <DialogAtom elementToEdit={elementToEdit} grid={grid} setGrid={setGrid} setElementToEdit={setElementToEdit} />

        </div >
    );
}


