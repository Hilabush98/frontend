import React from "react";
import { ButtonCustom } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FieldControl = "text" | "number" | "boolean" | "select";

export interface PropField {
    key: string;            // Clave de la prop (ej: 'placeHolder', 'disabled')
    label: string;          // Etiqueta legible para el usuario
    control: FieldControl;  // Tipo de input a renderizar
    options?: { label: string; value: any }[]; // Solo si es 'select'
}

export interface AtomDefinition {
    name: string;
    component: React.ComponentType<any>;
    defaultProps: Record<string, any>;
    editableFields: PropField[];
}

export const ATOM_REGISTRY: Record<string, AtomDefinition> = {
    button: {
        name: "Botón",
        component: ButtonCustom,
        defaultProps: {
            placeHolder: "Haz clic",
            disabled: false,
            variant: "default",
        },
        editableFields: [
            { key: "placeHolder", label: "Texto del botón", control: "text" },
            { key: "disabled", label: "Deshabilitado", control: "boolean" },
            {
                key: "variant",
                label: "Variante de diseño",
                control: "select",
                options: [
                    { label: "Default", value: "default" },
                    { label: "Outline", value: "outline" },
                    { label: "Destructive", value: "destructive" },
                ],
            },
        ],
    },
    input: {
        name: "Entrada de Texto",
        component: Input,
        defaultProps: {
            placeholder: "Escribe aquí...",
            disabled: false,
        },
        editableFields: [
            { key: "placeholder", label: "Texto de ayuda (placeholder)", control: "text" },
            { key: "disabled", label: "Deshabilitado", control: "boolean" },
        ],
    },
    label: {
        name: "Etiqueta",
        component: ({ text, ...props }: any) => <Label {...props}>{text}</Label>,
        defaultProps: {
            text: "Texto de etiqueta",
        },
        editableFields: [
            { key: "text", label: "Contenido del texto", control: "text" },
        ],
    },
    // ➕ Para agregar TextArea, ComboBox, etc., ¡solo agregas un objeto aquí!
};