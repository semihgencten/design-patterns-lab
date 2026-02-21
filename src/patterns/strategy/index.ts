import type { DesignPatternModule } from '../../core/types/pattern.types';
import { createStrategySimulation } from './StrategySimulation';
import { StrategyVisualization } from './StrategyVisualization';

export const StrategyPattern: DesignPatternModule = {
    metadata: {
        id: 'strategy',
        title: 'Strategy Pattern',
        description: 'Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
        difficulty: 'beginner',
        category: 'behavioral'
    },
    createSimulation: createStrategySimulation,
    Visualization: StrategyVisualization,
};
