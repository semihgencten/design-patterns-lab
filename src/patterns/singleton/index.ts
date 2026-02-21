import type { DesignPatternModule } from '../../core/types/pattern.types';
import { createSingletonSimulation } from './SingletonSimulation';
import { SingletonVisualization } from './SingletonVisualization';

export const SingletonPattern: DesignPatternModule = {
    metadata: {
        id: 'singleton',
        title: 'Singleton Pattern',
        description: 'Ensure a class only has one instance, and provide a global point of access to it.',
        difficulty: 'beginner',
        category: 'creational'
    },
    createSimulation: createSingletonSimulation,
    Visualization: SingletonVisualization,
};
