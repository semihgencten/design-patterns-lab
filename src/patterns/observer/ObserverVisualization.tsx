import { useEffect, useState } from 'react';
import type { PatternSimulation } from '../../core/types/pattern.types';
import type { ObserverState, ObserverAction } from './ObserverSimulation';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function ObserverVisualization({ simulation }: { simulation: PatternSimulation<ObserverState, ObserverAction> }) {
    const [state, setState] = useState<ObserverState>(simulation.getState());

    useEffect(() => {
        const unsub = simulation.subscribe((newState) => setState({ ...newState }));
        return unsub;
    }, [simulation]);

    const generateNodeId = () => `Dev-${Math.floor(Math.random() * 1000)}`;

    const generatePayload = () => {
        const payloads = ['DATA_SYNC_COMPLETE', 'USER_LOGGED_IN', 'SYSTEM_UPDATE', 'PREFERENCES_SAVED'];
        return payloads[Math.floor(Math.random() * payloads.length)];
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-8">
            {/* Visual Canvas Area */}
            <div className="flex-1 border border-gray-800 rounded-xl bg-dark-surface relative flex items-center justify-center overflow-hidden">

                {/* Subject (Broadcast Tower) */}
                <div className="relative z-10">
                    <motion.div
                        key={state.eventCount} // Forces quick animation on event emit
                        initial={{ scale: 0.9, borderColor: '#3b82f6' }}
                        animate={{ scale: 1, borderColor: '#60a5fa' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="w-24 h-24 rounded-full border-4 border-primary-blue bg-primary-blue/10 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    >
                        <span className="text-xs uppercase font-bold text-blue-400">Subject</span>
                        <span className="text-[10px] text-gray-400 truncate max-w-[80%]">{state.subjectState}</span>
                    </motion.div>

                    {/* Broadcast Ring Wave */}
                    <AnimatePresence>
                        {state.eventCount > 0 && (
                            <motion.div
                                key={`wave-${state.eventCount}`}
                                initial={{ opacity: 0.8, scale: 1 }}
                                animate={{ opacity: 0, scale: 4 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="absolute inset-0 border-2 border-primary-blue rounded-full pointer-events-none"
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Observers (Subscribers) */}
                {state.observers.map((observer, index) => {
                    const total = state.observers.length;
                    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
                    const radius = 140; // distance from center
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <motion.div
                            key={observer.id}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1, x, y }}
                            exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                            className="absolute w-20 h-20 bg-dark-panel border border-gray-700 rounded-xl flex flex-col items-center justify-center p-2 shadow-lg z-20 cursor-pointer hover:border-red-500/50 group"
                            onClick={() => simulation.dispatch({ type: 'REMOVE_OBSERVER', id: observer.id })}
                            title="Click to Unsubscribe"
                        >
                            <span className="text-[10px] text-gray-500 font-mono mb-1">{observer.id}</span>
                            <motion.div
                                key={`msg-${state.eventCount}`}
                                initial={{ color: '#fff' }}
                                animate={{ color: ['#60a5fa', '#9ca3af'] }}
                                transition={{ duration: 1 }}
                                className="text-[10px] text-center font-bold text-gray-400 truncate w-full"
                            >
                                {observer.lastMessage || 'Waiting...'}
                            </motion.div>

                            {/* Connecting Line (Using absolute pseudo-element styled via JS or SVG - using simple approach here) */}
                            <svg className="absolute -z-10 w-[300px] h-[300px] pointer-events-none" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad)` }}>
                                <line x1="150" y1="150" x2="150" y2={150 - radius} stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
                                <motion.line
                                    key={`ping-${state.eventCount}`}
                                    initial={{ pathLength: 0, opacity: 1 }}
                                    animate={{ pathLength: 1, opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    x1="150" y1="150" x2="150" y2={150 - radius}
                                    stroke="#3b82f6" strokeWidth="2"
                                />
                            </svg>
                        </motion.div>
                    );
                })}
            </div>

            {/* Control Panel Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-200">Controls</h3>
                    <Button onClick={() => simulation.dispatch({ type: 'EMIT_EVENT', payload: generatePayload() })}>
                        Broadcast Event
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="flex-1 text-xs" onClick={() => simulation.dispatch({ type: 'ADD_OBSERVER', id: generateNodeId() })}>
                            + Sub
                        </Button>
                        <Button variant="danger" className="flex-1 text-xs" onClick={() => simulation.dispatch({ type: 'RESET' })}>
                            Reset
                        </Button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-center">Click a node to unsubscribe it.</p>
                </div>

                {/* Logs Area */}
                <div className="h-80 shrink-0 bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-200 mb-3">Runtime Logs</h3>
                    <div className="flex-1 border border-gray-800 bg-[#0d0d0d] rounded-lg p-3 overflow-y-auto font-mono text-xs flex flex-col gap-1">
                        {state.logs.slice().reverse().map((log, i) => (
                            <div key={i} className="text-gray-400">
                                <span className="text-gray-600">[{state.logs.length - 1 - i}]</span> {log}
                            </div>
                        ))}
                        {state.logs.length === 0 && <span className="text-gray-600">Waiting for actions...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
