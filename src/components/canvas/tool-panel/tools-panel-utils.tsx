import React, { Children } from 'react';
import { useDraggable } from '@dnd-kit/react';
import { Button } from '@/components/ui/button';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';

interface DraggableProps {
    id: string;
    children: any;
    ctype?: string;
    index?: any;
}
export const Draggable = (props: DraggableProps) => {
    const { ref } = useDraggable({
        id: props.id,
    });
    return React.cloneElement(props.children, { ref: ref, });
    // return <Button ref={ref}>Draggable</Button>
};

export function Sortable({ id, index, children }: DraggableProps) {
    const { ref } = useSortable({ id, index });

    return React.cloneElement(children, { ref: ref, });
}


export function SortableItem({ id, index, children, onDelete }: any) {
    const { ref } = useSortable({ id, index });

    return (
        <div
            ref={ref}
            className="group relative ml-2 mr-2 mt-1 mb-1 border border-dashed border-transparent hover:border-blue-400 rounded-md "
        >
            <button

                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md cursor-pointer"
            >
                ✕
            </button>

            {children}
        </div>
    );
}