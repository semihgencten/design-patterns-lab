import { createStore } from 'zustand/vanilla';
import type { PatternSimulation } from '../../core/types/pattern.types';

export interface ObserverNode {
    id: string;
    lastMessage: string | null;
    isActive: boolean;
}

export interface ObserverState {
    subjectState: string;
    observers: ObserverNode[];
    logs: string[];
    eventCount: number;
}

export type ObserverAction =
    | { type: 'ADD_OBSERVER'; id: string }
    | { type: 'REMOVE_OBSERVER'; id: string }
    | { type: 'EMIT_EVENT'; payload: string }
    | { type: 'RESET' };

export const createObserverSimulation = (): PatternSimulation<ObserverState, ObserverAction> => {
    const store = createStore<ObserverState>(() => ({
        subjectState: 'Idle',
        observers: [],
        logs: [],
        eventCount: 0,
    }));

    const dispatch = (action: ObserverAction) => {
        switch (action.type) {
            case 'ADD_OBSERVER':
                store.setState((prev) => {
                    if (prev.observers.some(o => o.id === action.id)) return prev;
                    return {
                        ...prev,
                        observers: [...prev.observers, { id: action.id, lastMessage: null, isActive: true }],
                        logs: [...prev.logs, `➕ Observer [${action.id}] subscribed.`],
                    };
                });
                break;

            case 'REMOVE_OBSERVER':
                store.setState((prev) => ({
                    ...prev,
                    observers: prev.observers.filter((o) => o.id !== action.id),
                    logs: [...prev.logs, `❌ Observer [${action.id}] unsubscribed.`],
                }));
                break;

            case 'EMIT_EVENT':
                store.setState((prev) => ({
                    ...prev,
                    subjectState: action.payload,
                    eventCount: prev.eventCount + 1,
                    observers: prev.observers.map((o) => ({ ...o, lastMessage: action.payload })),
                    logs: [
                        ...prev.logs,
                        `📡 Subject emitted state: "${action.payload}"`,
                        ...prev.observers.map((o) => `   └─ Observer [${o.id}] received: "${action.payload}"`),
                    ],
                }));
                break;

            case 'RESET':
                store.setState({
                    subjectState: 'Idle',
                    observers: [],
                    logs: ['System Reset.'],
                    eventCount: 0,
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
