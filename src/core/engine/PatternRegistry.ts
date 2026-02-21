import type { DesignPatternModule, PatternID } from '../types/pattern.types';

export class PatternEngine {
    private static patterns = new Map<PatternID, DesignPatternModule>();

    static register(pattern: DesignPatternModule) {
        this.patterns.set(pattern.metadata.id, pattern);
    }

    static getPattern(id: PatternID): DesignPatternModule | undefined {
        return this.patterns.get(id);
    }

    static getAllPatterns(): DesignPatternModule[] {
        return Array.from(this.patterns.values());
    }
}
