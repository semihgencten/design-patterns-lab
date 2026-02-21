import type { DesignPatternModule } from '../../core/types/pattern.types';
import { createObserverSimulation } from './ObserverSimulation';
import { ObserverVisualization } from './ObserverVisualization';

export const ObserverPattern: DesignPatternModule = {
    metadata: {
        id: 'observer',
        title: 'Observer Pattern',
        description: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
        difficulty: 'intermediate',
        category: 'behavioral'
    },
    createSimulation: createObserverSimulation,
    Visualization: ObserverVisualization,
};
