export type PatternID = 'singleton' | 'observer' | string;

export interface PatternMetadata {
    id: PatternID;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'creational' | 'behavioral' | 'structural';
}

export interface DesignPatternModule {
    metadata: PatternMetadata;
    createSimulation: () => PatternSimulation<any, any>;
    Visualization: React.FC<{ simulation: PatternSimulation<any, any> }>;
}

export interface PatternSimulation<State, Action> {
    getState: () => State;
    dispatch: (action: Action) => void;
    subscribe: (listener: (state: State) => void) => () => void;
}
