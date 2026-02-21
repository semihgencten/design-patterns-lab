import { createStore } from 'zustand/vanilla';
import type { PatternSimulation } from '../../core/types/pattern.types';

export type ProductType = 'SQUARE' | 'CIRCLE' | 'TRIANGLE';

export interface ProductInstance {
    id: string;
    type: ProductType;
    color: string;
    timestamp: number;
}

export interface FactoryState {
    inventory: ProductInstance[];
    logs: string[];
    isManufacturing: boolean;
    totalProduced: number;
}

export type FactoryAction =
    | { type: 'ORDER_PRODUCT'; productType: ProductType }
    | { type: 'FINISH_MANUFACTURING'; product: ProductInstance }
    | { type: 'CLEAR_INVENTORY' };

const generateId = () => `PRD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const TYPE_COLORS: Record<ProductType, string> = {
    SQUARE: '#3b82f6', // blue
    CIRCLE: '#ef4444', // red
    TRIANGLE: '#10b981' // green
};

export const createFactorySimulation = (): PatternSimulation<FactoryState, FactoryAction> => {
    const store = createStore<FactoryState>(() => ({
        inventory: [],
        logs: ['Factory Assembly Line Ready.'],
        isManufacturing: false,
        totalProduced: 0,
    }));

    const dispatch = (action: FactoryAction) => {
        switch (action.type) {
            case 'ORDER_PRODUCT':
                store.setState((prev) => ({
                    ...prev,
                    isManufacturing: true,
                    logs: [...prev.logs, `Received order for ${action.productType}. Manufacturing...`],
                }));
                // React component handles delay for animation syncing
                break;

            case 'FINISH_MANUFACTURING':
                store.setState((prev) => ({
                    ...prev,
                    isManufacturing: false,
                    inventory: [...prev.inventory, action.product],
                    totalProduced: prev.totalProduced + 1,
                    logs: [...prev.logs, `✅ Produced ${action.product.type} [${action.product.id}]`],
                }));
                break;

            case 'CLEAR_INVENTORY':
                store.setState((prev) => ({
                    ...prev,
                    inventory: [],
                    logs: [...prev.logs, '🗑️ Inventory cleared.'],
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

export const getProductColor = (type: ProductType) => TYPE_COLORS[type];
export const createMockProduct = (type: ProductType): ProductInstance => ({
    id: generateId(),
    type,
    color: TYPE_COLORS[type],
    timestamp: Date.now()
});
