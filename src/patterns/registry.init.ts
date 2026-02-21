import { PatternEngine } from '../core/engine/PatternRegistry';
import { SingletonPattern } from './singleton';
import { ObserverPattern } from './observer';
import { StrategyPattern } from './strategy';
import { FactoryPattern } from './factory';
import { DecoratorPattern } from './decorator';

export function initializePatterns() {
    PatternEngine.register(SingletonPattern);
    PatternEngine.register(ObserverPattern);
    PatternEngine.register(StrategyPattern);
    PatternEngine.register(FactoryPattern);
    PatternEngine.register(DecoratorPattern);
}
