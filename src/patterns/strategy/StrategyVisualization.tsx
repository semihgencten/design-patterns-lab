import { useEffect, useState } from 'react';
import type { PatternSimulation } from '../../core/types/pattern.types';
import type { StrategyState, StrategyAction, StrategyType } from './StrategySimulation';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const STRATEGY_METADATA: Record<StrategyType, { name: string; color: string; duration: number }> = {
    FAST_QUICKSORT: { name: 'QuickSort Strategy', color: '#ef4444', duration: 600 },
    STABLE_MERGESORT: { name: 'MergeSort Strategy', color: '#3b82f6', duration: 1200 },
    SIMPLE_BUBBLESORT: { name: 'BubbleSort Strategy', color: '#eab308', duration: 2500 }
};

export function StrategyVisualization({ simulation }: { simulation: PatternSimulation<StrategyState, StrategyAction> }) {
    const [state, setState] = useState<StrategyState>(simulation.getState());

    useEffect(() => {
        const unsub = simulation.subscribe((newState) => setState({ ...newState }));
        return unsub;
    }, [simulation]);

    // Handle mock execution delay in the component to easily sync with Framer Motion duration
    useEffect(() => {
        if (state.isExecuting) {
            const meta = STRATEGY_METADATA[state.currentStrategy];
            const timer = setTimeout(() => {
                const sorted = [...state.arrayData].sort((a, b) => a - b);
                simulation.dispatch({
                    type: 'FINISH_EXECUTION',
                    sortedData: sorted,
                    logMessage: `✅ Sorted ${sorted.length} items using ${meta.name} in ~${meta.duration}ms.`
                });
            }, meta.duration);
            return () => clearTimeout(timer);
        }
    }, [state.isExecuting, state.currentStrategy, state.arrayData, simulation]);

    const activeMeta = STRATEGY_METADATA[state.currentStrategy];

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-8">
            {/* Visual Canvas Area */}
            <div className="flex-1 border border-gray-800 rounded-xl bg-dark-surface relative flex flex-col items-center justify-center overflow-hidden p-8 gap-12">

                {/* Context Object */}
                <div className="relative w-64 p-4 border border-gray-700 bg-dark-panel rounded-xl flex flex-col items-center shadow-lg">
                    <h4 className="text-gray-300 font-bold mb-4">Context (Sorter API)</h4>

                    {/* Swappable Strategy Slot */}
                    <div className="w-full h-20 border-2 border-dashed border-gray-600 rounded-lg relative flex items-center justify-center bg-black/20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={state.currentStrategy}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="absolute inset-2 rounded-md flex items-center justify-center font-bold text-sm shadow-md"
                                style={{ backgroundColor: `${activeMeta.color}33`, border: `1px solid ${activeMeta.color}`, color: activeMeta.color }}
                            >
                                {activeMeta.name}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Data Array Visualization */}
                <div className="flex gap-2 items-end h-32 w-full justify-center">
                    {state.arrayData.map((val, idx) => (
                        <motion.div
                            layout
                            key={`${state.executionCount}-${val}-${idx}`}
                            initial={{ height: `${val}%`, backgroundColor: '#374151' }}
                            animate={state.isExecuting ? {
                                backgroundColor: ['#374151', activeMeta.color, '#374151'],
                                transition: { repeat: Infinity, duration: 0.5, delay: idx * 0.1 }
                            } : {
                                height: `${val}%`,
                                backgroundColor: state.executionCount > 0 && [...state.arrayData].sort((a, b) => a - b)[idx] === val ? '#10b981' : '#374151'
                            }}
                            className="w-8 rounded-t-md flex items-end justify-center pb-2 text-[10px] text-white font-mono"
                        >
                            {val}
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Control Panel Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-200">Strategies</h3>
                    <div className="grid grid-cols-1 gap-2 mb-2">
                        {(Object.keys(STRATEGY_METADATA) as StrategyType[]).map((type) => (
                            <Button
                                key={type}
                                variant={state.currentStrategy === type ? 'primary' : 'secondary'}
                                onClick={() => simulation.dispatch({ type: 'SET_STRATEGY', strategy: type })}
                                disabled={state.isExecuting}
                                className="text-sm py-1.5"
                                style={state.currentStrategy === type ? { backgroundColor: STRATEGY_METADATA[type].color } : {}}
                            >
                                {STRATEGY_METADATA[type].name}
                            </Button>
                        ))}
                    </div>

                    <h3 className="font-semibold text-gray-200 mt-2">Actions</h3>
                    <Button
                        onClick={() => simulation.dispatch({ type: 'EXECUTE' })}
                        disabled={state.isExecuting}
                    >
                        {state.isExecuting ? 'Executing...' : 'Execute Sort'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => simulation.dispatch({ type: 'RESET_DATA' })}
                        disabled={state.isExecuting}
                    >
                        Randomize Data
                    </Button>
                </div>

                {/* Logs Area */}
                <div className="h-80 shrink-0 bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-200 mb-3">Runtime Logs</h3>
                    <div className="flex-1 border border-gray-800 bg-[#0d0d0d] rounded-lg p-3 overflow-y-auto font-mono text-xs flex flex-col gap-2">
                        {state.logs.slice().reverse().map((log, i) => (
                            <div key={i} className="text-gray-400 border-l-2 pl-2 border-gray-700">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
