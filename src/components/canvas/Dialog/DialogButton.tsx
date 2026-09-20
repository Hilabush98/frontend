import React, { useState, useEffect, } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button, ButtonCustom } from '../../ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { any } from "zod";


export const DialogAtom = ({ elementToEdit, grid, setGrid, setElementToEdit }: any) => {
    // 1. Estado local de propiedades a editar
    const [propsState, setPropsState] = useState<any>({});
    console.log("element:", elementToEdit)
    // 2. Cargamos las propiedades existentes al abrir el modal
    useEffect(() => {
        if (elementToEdit) {
            setPropsState({
                text: elementToEdit.props?.placeHolder || "Button",
                disabled: elementToEdit.props?.disabled || false
            });
        }
    }, [elementToEdit]);

    // 3. Función para guardar los cambios en el grid
    const saveProps = () => {
        if (!elementToEdit) return;

        setGrid((prevGrid: any[]) => prevGrid.map(row => ({
            ...row,
            columns: row.columns.map(col => {
                if (col.id === elementToEdit.id) {
                    console.log("col", col)
                    // 🔴 1. Regeneramos el JSX visual del botón con las nuevas propiedades
                    const updatedVisualElement = (
                        <Button
                            variant={propsState.variant || "default"}
                            size={propsState.size || "sm"}
                            disabled={propsState.disabled}
                        >
                            {propsState.text || "Button"}
                        </Button>
                    );

                    // 🔴 2. Guardamos tanto el nuevo elemento visual como los props actualizados
                    return {
                        ...col,
                        element: React.cloneElement(updatedVisualElement, {
                            id: col.element?.props?.id,
                            ctype: col.element?.props?.ctype
                        }),
                        props: {
                            ...col.props,
                            ...propsState
                        }
                    };
                }
                return col;
            })
        })));

        // Cerramos el modal
        setElementToEdit(null);
    };


    return (
        <Dialog open={!!elementToEdit} onOpenChange={(open) => !open && setElementToEdit(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Propiedades del Átomo</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Vista previa */}
                    <div className="flex justify-center p-4 border rounded-md bg-muted/20">
                        {elementToEdit?.element}
                    </div>

                    {/* Controles de edición */}
                    <div className="flex flex-col gap-2">
                        <Label>Texto del botón</Label>
                        <Input
                            value={propsState.text}
                            onChange={(e) => setPropsState(prev => ({ ...prev, text: e.target.value }))}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={propsState.disabled}
                            onChange={(e) => setPropsState(prev => ({ ...prev, disabled: e.target.checked }))}
                            className="w-4 h-4"
                        />
                        Deshabilitado
                    </label>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setElementToEdit(null)}>
                        Cancelar
                    </Button>
                    <Button onClick={saveProps}>
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};