import { createStore } from 'zustand/vanilla';
import type { PatternSimulation } from '../../core/types/pattern.types';

export interface SingletonState {
    hasInstance: boolean;
    logs: string[];
    accessAttempts: number;
}

export type SingletonAction =
    | { type: 'REQUEST_INSTANCE', threadId: string }
    | { type: 'RESET' };

export const createSingletonSimulation = (): PatternSimulation<SingletonState, SingletonAction> => {
    const store = createStore<SingletonState>(() => ({
        hasInstance: false,
        logs: [],
        accessAttempts: 0,
    }));

    const dispatch = (action: SingletonAction) => {
        const state = store.getState();

        switch (action.type) {
            case 'REQUEST_INSTANCE':
                if (!state.hasInstance) {
                    store.setState((prev) => ({
                        hasInstance: true,
                        accessAttempts: prev.accessAttempts + 1,
                        logs: [...prev.logs, `Thread [${action.type}] - Initializing NEW instance...`],
                    }));
                } else {
                    store.setState((prev) => ({
                        accessAttempts: prev.accessAttempts + 1,
                        logs: [...prev.logs, `Thread [${action.type}] - Returning EXISTING instance...`],
                    }));
                }
                break;
            case 'RESET':
                store.setState({
                    hasInstance: false,
                    logs: ['System Reset. Instance destroyed.'],
                    accessAttempts: 0,
                });
                break;
        }
    };

    return {
        getState: store.getState,
        dispatch,
        subscribe: store.subscribe,
    };
};
