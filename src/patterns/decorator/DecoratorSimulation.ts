import { createStore } from 'zustand/vanilla';
import type { PatternSimulation } from '../../core/types/pattern.types';

export interface DecoratorLayer {
    id: string;
    name: string;
    costModifier: number;
    color: string;
}

export interface DecoratorState {
    baseCost: number;
    layers: DecoratorLayer[];
    logs: string[];
}

export type DecoratorAction =
    | { type: 'APPLY_DECORATOR'; layer: DecoratorLayer }
    | { type: 'REMOVE_TOP_DECORATOR' }
    | { type: 'RESET_BASE' };

export const DECORATORS: DecoratorLayer[] = [
    { id: 'shield', name: 'Energy Shield', costModifier: 150, color: '#3b82f6' },
    { id: 'armor', name: 'Heavy Armor Plate', costModifier: 300, color: '#64748b' },
    { id: 'camo', name: 'Stealth Coating', costModifier: 500, color: '#10b981' },
];

export const createDecoratorSimulation = (): PatternSimulation<DecoratorState, DecoratorAction> => {
    const store = createStore<DecoratorState>(() => ({
        baseCost: 1000,
        layers: [],
        logs: ['Core instantiated. Base Cost: 1000.'],
    }));

    const dispatch = (action: DecoratorAction) => {
        switch (action.type) {
            case 'APPLY_DECORATOR':
                store.setState((prev) => {
                    const newLayers = [...prev.layers, action.layer];
                    const totalCost = prev.baseCost + newLayers.reduce((acc, l) => acc + l.costModifier, 0);
                    return {
                        ...prev,
                        layers: newLayers,
                        logs: [...prev.logs, `Wrapped with [${action.layer.name}]. Added ${action.layer.costModifier} to cost. (Total: ${totalCost})`],
                    };
                });
                break;

            case 'REMOVE_TOP_DECORATOR':
                store.setState((prev) => {
                    if (prev.layers.length === 0) return prev;
                    const newLayers = prev.layers.slice(0, -1);
                    const removed = prev.layers[prev.layers.length - 1];
                    const totalCost = prev.baseCost + newLayers.reduce((acc, l) => acc + l.costModifier, 0);
                    return {
                        ...prev,
                        layers: newLayers,
                        logs: [...prev.logs, `Removed wrapper [${removed.name}]. Removed ${removed.costModifier} from cost. (Total: ${totalCost})`],
                    };
                });
                break;

            case 'RESET_BASE':
                store.setState((prev) => ({
                    ...prev,
                    layers: [],
                    logs: [...prev.logs, 'Extracted core. All decorators stripped. Total Cost: 1000.'],
                }));
                break;
        }
    };

    return {
        getState: store.getState,
        dispatch,
        subscribe: store.subscribe,
    };
};
