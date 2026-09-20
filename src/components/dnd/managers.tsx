import {
    DragDropManager,
    PointerSensor,
    PointerActivationConstraints,
} from '@dnd-kit/dom';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';

export const manager = new DragDropManager({
    // Add a plugin to the defaults
    plugins: (defaults) => [...defaults],

    // Configure a default sensor
    sensors: (defaults) => [
        ...defaults,
        PointerSensor.configure({
            activationConstraints: [
                new PointerActivationConstraints.Distance({ value: 5 }),
            ],
        }),
    ],

    // Add a modifier
    modifiers: (defaults) => [...defaults, RestrictToWindow],
});
