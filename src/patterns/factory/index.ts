import type { DesignPatternModule } from '../../core/types/pattern.types';
import { createFactorySimulation } from './FactorySimulation';
import { FactoryVisualization } from './FactoryVisualization';

export const FactoryPattern: DesignPatternModule = {
    metadata: {
        id: 'factory',
        title: 'Factory Pattern',
        description: 'Provide an interface for creating objects in a superclass, but allow subclasses to alter the type of objects that will be created.',
        difficulty: 'beginner',
        category: 'creational'
    },
    createSimulation: createFactorySimulation,
    Visualization: FactoryVisualization,
};
