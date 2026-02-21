import { useEffect, useState } from 'react';
import type { PatternSimulation } from '../../core/types/pattern.types';
import type { SingletonState, SingletonAction } from './SingletonSimulation';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function SingletonVisualization({ simulation }: { simulation: PatternSimulation<SingletonState, SingletonAction> }) {
    const [state, setState] = useState<SingletonState>(simulation.getState());

    useEffect(() => {
        const unsub = simulation.subscribe((newState) => setState({ ...newState }));
        return unsub;
    }, [simulation]);

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-8">
            {/* Visual Canvas Area */}
            <div className="flex-1 border border-gray-800 rounded-xl bg-dark-surface relative flex items-center justify-center overflow-hidden">
                {/* Central Server Node */}
                <div className="relative">
                    <AnimatePresence>
                        {!state.hasInstance ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-32 h-32 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center"
                            >
                                <span className="text-gray-500 text-sm">No Instance</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="instance"
                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.6 }}
                                className="w-32 h-32 bg-primary-purple/20 border-2 border-primary-purple rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.4)]"
                            >
                                <div className="w-16 h-16 bg-primary-purple rounded-full animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                    Access Attempts: {state.accessAttempts}
                </div>
            </div>

            {/* Control Panel Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-200">Controls</h3>
                    <Button onClick={() => simulation.dispatch({ type: 'REQUEST_INSTANCE', threadId: 'A' })}>
                        Request Instance
                    </Button>
                    <Button variant="danger" onClick={() => simulation.dispatch({ type: 'RESET' })}>
                        Reset System
                    </Button>
                </div>

                {/* Logs Area */}
                <div className="h-80 shrink-0 bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-200 mb-3">Runtime Logs</h3>
                    <div className="flex-1 border border-gray-800 bg-[#0d0d0d] rounded-lg p-3 overflow-y-auto font-mono text-xs flex flex-col gap-1">
                        {state.logs.map((log, i) => (
                            <div key={i} className="text-gray-400">
                                <span className="text-gray-600">[{i}]</span> {log}
                            </div>
                        ))}
                        {state.logs.length === 0 && <span className="text-gray-600">Waiting for actions...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
