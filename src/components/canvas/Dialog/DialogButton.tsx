import React, { useState, useEffect, } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button, ButtonCustom } from '../../ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { any } from "zod";


export const DialogAtomButton = ({ elementToEdit, grid, setGrid, setElementToEdit }: any) => {

    // 1. Estado inicializado con valores por defecto para evitar warnings de inputs descontrolados
    const [propsState, setPropsState] = useState<any>({
        placeHolder: "Button",
        disabled: false,
        variant: "default",
        size: "sm"
    });
    const [cellProps, setCellProps] = useState<any>({ sizecell: 1 })



    // 2. Cargamos las propiedades existentes al abrir el modal (Unificando propiedades)
    useEffect(() => {
        if (elementToEdit) {
            console.log(elementToEdit)
            setPropsState({
                // Usamos 'text' de forma consistente. Si antes usabas 'placeHolder', unifícalo aquí
                placeHolder: elementToEdit.props?.componentProps?.placeHolder || "Button",
                disabled: elementToEdit.props?.componentProps?.disabled || false,
                variant: elementToEdit.props?.componentProps?.variant || "default",
                size: elementToEdit.props?.componentProps?.size || "sm",
                //                sizeCell: elementToEdit.sizeCell
            });
            setCellProps({
                sizeCell: elementToEdit.sizeCell
            })

        }
    }, [elementToEdit]);

    // 3. Función para guardar los cambios en el grid
    const saveProps = () => {
        if (!elementToEdit) return;

        setGrid((prevGrid: any[]) => prevGrid.map(row => ({
            ...row,
            columns: row.columns.map(col => {
                if (col.id === elementToEdit.id) {

                    // 🔴 1. Regeneramos el JSX visual del botón con las nuevas propiedades
                    const updatedVisualElement = (
                        <ButtonCustom
                            variant={propsState.variant}
                            size={propsState.size}
                            disabled={propsState.disabled}
                            placeHolder={propsState.placeHolder}
                        />

                    );
                    console.log(updatedVisualElement)
                    // 🔴 2. Guardamos tanto el nuevo elemento visual como los props actualizados
                    return {
                        ...col,
                        sizeCell: cellProps.sizeCell,
                        element: React.cloneElement(updatedVisualElement, {
                            id: col.element?.props?.id,
                            ctype: col.element?.props?.ctype,
                            props: { ...col.element.props }
                        }),
                        props: {
                            ...col.props,
                            componentProps: { ...propsState } // Guarda 'text', 'disabled', etc.
                        }
                    };
                }
                return col;
            })
        })));
        console.log(grid)
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
                    {/* 👁️ Vista previa (Se re-renderiza inmediatamente gracias a propsState) */}
                    <div className="flex justify-center p-4 border rounded-md bg-muted/20">
                        <ButtonCustom
                            variant={propsState.variant}
                            size={propsState.size}
                            disabled={propsState.disabled}
                            placeHolder={propsState.placeHolder}
                        />

                    </div>

                    {/* ✍️ Controles de edición */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="btn-text">Texto del botón</Label>
                        <Input
                            id="btn-text"
                            value={propsState.placeHolder}
                            onChange={(e) => setPropsState(prev => ({ ...prev, placeHolder: e.target.value }))}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="btn-text">Size de la celda</Label>
                        <Input
                            id="btn-text"
                            value={cellProps.sizeCell}
                            onChange={(e) => setCellProps(prev => ({ ...prev, sizeCell: e.target.value }))}
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={propsState.disabled}
                            onChange={(e) => setPropsState(prev => ({ ...prev, disabled: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
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
