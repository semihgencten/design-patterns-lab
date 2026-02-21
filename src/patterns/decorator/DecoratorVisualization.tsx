import { useEffect, useState } from 'react';
import type { PatternSimulation } from '../../core/types/pattern.types';
import { type DecoratorState, type DecoratorAction, DECORATORS } from './DecoratorSimulation';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function DecoratorVisualization({ simulation }: { simulation: PatternSimulation<DecoratorState, DecoratorAction> }) {
    const [state, setState] = useState<DecoratorState>(simulation.getState());

    useEffect(() => {
        const unsub = simulation.subscribe((newState) => setState({ ...newState }));
        return unsub;
    }, [simulation]);

    const totalCost = state.baseCost + state.layers.reduce((acc, l) => acc + l.costModifier, 0);

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-8">
            {/* Visual Canvas Area */}
            <div className="flex-1 border border-gray-800 rounded-xl bg-dark-surface relative flex items-center justify-center p-8 overflow-hidden">

                {/* Core & Wrappers Container */}
                <div className="relative flex items-center justify-center w-[400px] h-[400px]">

                    <AnimatePresence>
                        {/* Draw Layers outward from the core */}
                        {[...state.layers].reverse().map((layer, index) => {
                            const actualIndex = state.layers.length - 1 - index;
                            // Size increases based on its position in the stack (older layers are larger/further out)
                            const size = 120 + (actualIndex + 1) * 60;

                            return (
                                <motion.div
                                    key={`${layer.id}-${actualIndex}`} // allow identical layers if stacked successively
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.1, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className="absolute rounded-full border-4 border-dashed drop-shadow-lg flex flex-col items-center justify-start pt-2"
                                    style={{
                                        width: size,
                                        height: size,
                                        borderColor: layer.color,
                                        backgroundColor: `${layer.color}15`,
                                        zIndex: 10 - actualIndex
                                    }}
                                >
                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-dark-surface/80" style={{ color: layer.color }}>
                                        {layer.name} (+{layer.costModifier})
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Core Object (Always visible in center) */}
                    <div className="w-24 h-24 bg-dark-panel border-4 border-gray-600 rounded-full flex flex-col items-center justify-center z-50 shadow-2xl relative">
                        <span className="text-gray-400 font-bold text-sm">CORE</span>
                        <span className="text-xs text-gray-500">{state.baseCost} Cms</span>

                        {/* Dynamic Link Line when layering */}
                        {state.layers.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute w-1 h-32 bg-gradient-to-t from-gray-600 to-transparent -bottom-24 -z-10"
                            />
                        )}
                    </div>

                </div>

                {/* Floating Total Cost Indicator */}
                <div className="absolute top-6 right-6 flex flex-col items-end">
                    <span className="text-gray-500 font-mono text-xs uppercase">Computed State</span>
                    <motion.div
                        key={totalCost}
                        initial={{ scale: 1.2, color: '#10b981' }}
                        animate={{ scale: 1, color: '#f3f4f6' }}
                        className="text-3xl font-extrabold"
                    >
                        {totalCost}
                    </motion.div>
                </div>

            </div>

            {/* Control Panel Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-200">Decorators (Wrappers)</h3>

                    <div className="grid grid-cols-1 gap-2 mb-2">
                        {DECORATORS.map((layer) => (
                            <Button
                                key={layer.id}
                                variant="secondary"
                                onClick={() => simulation.dispatch({ type: 'APPLY_DECORATOR', layer })}
                                className="flex justify-between items-center text-left px-3 py-2 border-l-4"
                                style={{ borderLeftColor: layer.color }}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{layer.name}</span>
                                    <span className="text-[10px] text-gray-400">Adds behavior / state</span>
                                </div>
                                <span className="text-xs font-mono" style={{ color: layer.color }}>+{layer.costModifier}</span>
                            </Button>
                        ))}
                    </div>

                    <h3 className="font-semibold text-gray-200 mt-2">Actions</h3>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            variant="secondary"
                            onClick={() => simulation.dispatch({ type: 'REMOVE_TOP_DECORATOR' })}
                            disabled={state.layers.length === 0}
                        >
                            Pop Wrapper
                        </Button>
                        <Button
                            className="flex-1"
                            variant="danger"
                            onClick={() => simulation.dispatch({ type: 'RESET_BASE' })}
                            disabled={state.layers.length === 0}
                        >
                            Strip Core
                        </Button>
                    </div>
                </div>

                {/* Logs Area */}
                <div className="h-80 shrink-0 bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-200 mb-3 text-sm">Runtime Logs</h3>
                    <div className="flex-1 border border-gray-800 bg-[#0d0d0d] rounded-lg p-3 overflow-y-auto font-mono text-xs flex flex-col gap-2">
                        {state.logs.slice().reverse().map((log, i) => (
                            <div key={i} className="text-gray-400">
                                <span className="text-gray-600">[{state.logs.length - 1 - i}]</span> {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
