import { create } from 'zustand';

interface AppState {
    xp: number;
    theme: 'dark' | 'light';
    completedPatterns: string[];
    addXp: (amount: number) => void;
    toggleTheme: () => void;
    markPatternCompleted: (patternId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    xp: 0,
    theme: 'dark',
    completedPatterns: [],
    addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    markPatternCompleted: (patternId) =>
        set((state) => ({
            completedPatterns: state.completedPatterns.includes(patternId)
                ? state.completedPatterns
                : [...state.completedPatterns, patternId],
        })),
}));
