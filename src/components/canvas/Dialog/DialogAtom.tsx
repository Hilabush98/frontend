import React, { useState, useEffect, } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button, ButtonCustom } from '../../ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { any } from "zod";
import { DialogAtomButton } from "./DialogButton";
import { ATOM_REGISTRY, PropField } from "./Registry";


export const DialogAtom = ({ elementToEdit, setGrid, setElementToEdit }: any) => {
    const [sizeCell, setSizeCell] = useState<number>(1);
    const [componentProps, setComponentProps] = useState<Record<string, any>>({});

    // 1. Identificamos la configuración según el tipo del elemento (ctype)
    const atomType = elementToEdit?.ctype || "button";
    const definition = ATOM_REGISTRY[atomType];

    useEffect(() => {
        if (elementToEdit) {
            setSizeCell(elementToEdit.size || 1);
            // Tomamos las props guardadas o las por defecto del registro
            setComponentProps({
                ...(definition?.defaultProps || {}),
                ...(elementToEdit.props || {}),
            });
        }
    }, [elementToEdit, definition]);

    if (!elementToEdit || !definition) return null;

    // Componente visual correspondiente
    const PreviewComponent = definition.component;

    // Guardado limpio: Solo guardamos DATOS (sin JSX clonado)
    const handleSave = () => {
        setGrid((prevGrid: any[]) =>
            prevGrid.map((row) => ({
                ...row,
                columns: row.columns.map((col: any) => {
                    if (col.id === elementToEdit.id) {
                        return {
                            ...col,
                            size: Number(sizeCell),
                            ctype: atomType,
                            props: componentProps, // Guardamos estado puro
                        };
                    }
                    return col;
                }),
            }))
        );
        setElementToEdit(null);
    };

    // Renderizador automático de cada campo
    const renderFieldControl = (field: PropField) => {
        const value = componentProps[field.key];

        switch (field.control) {
            case "boolean":
                return (
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={value ?? false}
                            onChange={(e) =>
                                setComponentProps((prev) => ({ ...prev, [field.key]: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-gray-300 text-primary"
                        />
                        {field.label}
                    </label>
                );

            case "select":
                return (
                    <div className="flex flex-col gap-1">
                        <Label>{field.label}</Label>
                        <select
                            value={value ?? ""}
                            onChange={(e) =>
                                setComponentProps((prev) => ({ ...prev, [field.key]: e.target.value }))
                            }
                            className="border rounded-md px-3 py-1.5 text-sm bg-background"
                        >
                            {field.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "number":
            case "text":
            default:
                return (
                    <div className="flex flex-col gap-1">
                        <Label>{field.label}</Label>
                        <Input
                            type={field.control === "number" ? "number" : "text"}
                            value={value ?? ""}
                            onChange={(e) =>
                                setComponentProps((prev) => ({
                                    ...prev,
                                    [field.key]: field.control === "number" ? Number(e.target.value) : e.target.value,
                                }))
                            }
                        />
                    </div>
                );
        }
    };

    return (
        <Dialog open={!!elementToEdit} onOpenChange={(open) => !open && setElementToEdit(null)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar {definition.name}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-3">
                    {/* 👁️ Vista previa en tiempo real */}
                    <div className="flex justify-center items-center min-h-[90px] p-4 border rounded-lg bg-muted/20">
                        <PreviewComponent {...componentProps} />
                    </div>

                    {/* 📐 Configuración general de la celda */}
                    <div className="flex flex-col gap-1">
                        <Label>Ancho de columna (1 a 6)</Label>
                        <Input
                            type="number"
                            min={1}
                            max={6}
                            value={sizeCell}
                            onChange={(e) => setSizeCell(Number(e.target.value))}
                        />
                    </div>

                    <div className="border-t my-1" />

                    {/* ⚙️ Propiedades dinámicas auto-generadas */}
                    <div className="flex flex-col gap-3">
                        {definition.editableFields.map((field) => (
                            <div key={field.key}>{renderFieldControl(field)}</div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setElementToEdit(null)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
//export { DialogAtom }