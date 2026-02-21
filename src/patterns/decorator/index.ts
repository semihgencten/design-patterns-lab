import type { DesignPatternModule } from '../../core/types/pattern.types';
import { createDecoratorSimulation } from './DecoratorSimulation';
import { DecoratorVisualization } from './DecoratorVisualization';

export const DecoratorPattern: DesignPatternModule = {
    metadata: {
        id: 'decorator',
        title: 'Decorator Pattern',
        description: 'Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
        difficulty: 'intermediate',
        category: 'structural'
    },
    createSimulation: createDecoratorSimulation,
    Visualization: DecoratorVisualization,
};
