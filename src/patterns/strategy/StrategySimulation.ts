import { createStore } from 'zustand/vanilla';
import type { PatternSimulation } from '../../core/types/pattern.types';

export type StrategyType = 'FAST_QUICKSORT' | 'STABLE_MERGESORT' | 'SIMPLE_BUBBLESORT';

export interface StrategyState {
    currentStrategy: StrategyType;
    arrayData: number[];
    logs: string[];
    isExecuting: boolean;
    executionCount: number;
}

export type StrategyAction =
    | { type: 'SET_STRATEGY'; strategy: StrategyType }
    | { type: 'EXECUTE' }
    | { type: 'FINISH_EXECUTION'; sortedData: number[]; logMessage: string }
    | { type: 'RESET_DATA' };

const generateRandomData = () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));

export const createStrategySimulation = (): PatternSimulation<StrategyState, StrategyAction> => {
    const store = createStore<StrategyState>(() => ({
        currentStrategy: 'FAST_QUICKSORT',
        arrayData: generateRandomData(),
        logs: ['Context initialized. No strategy executed yet.'],
        isExecuting: false,
        executionCount: 0,
    }));

    const dispatch = (action: StrategyAction) => {
        switch (action.type) {
            case 'SET_STRATEGY':
                store.setState((prev) => ({
                    ...prev,
                    currentStrategy: action.strategy,
                    logs: [...prev.logs, `Switched context behavior to: ${action.strategy}`],
                }));
                break;

            case 'EXECUTE':
                store.setState((prev) => ({
                    ...prev,
                    isExecuting: true,
                    executionCount: prev.executionCount + 1,
                    logs: [...prev.logs, `Executing behavior using ${prev.currentStrategy}...`],
                }));

                // We handle the actual logic and mock timeout in the React component for visualization syncing
                break;

            case 'FINISH_EXECUTION':
                store.setState((prev) => ({
                    ...prev,
                    isExecuting: false,
                    arrayData: action.sortedData,
                    logs: [...prev.logs, action.logMessage],
                }));
                break;

            case 'RESET_DATA':
                store.setState((prev) => ({
                    ...prev,
                    arrayData: generateRandomData(),
                    logs: [...prev.logs, 'Dataset randomized.'],
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
