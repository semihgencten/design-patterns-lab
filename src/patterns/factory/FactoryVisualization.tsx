import { useEffect, useState } from 'react';
import type { PatternSimulation } from '../../core/types/pattern.types';
import { type FactoryState, type FactoryAction, type ProductType, createMockProduct, getProductColor } from './FactorySimulation';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function FactoryVisualization({ simulation }: { simulation: PatternSimulation<FactoryState, FactoryAction> }) {
    const [state, setState] = useState<FactoryState>(simulation.getState());
    const [activeOrder, setActiveOrder] = useState<ProductType | null>(null);

    useEffect(() => {
        const unsub = simulation.subscribe((newState) => setState({ ...newState }));
        return unsub;
    }, [simulation]);

    // Handle mock execution delay in the component to easily sync with Framer Motion duration
    useEffect(() => {
        if (state.isManufacturing && activeOrder) {
            const timer = setTimeout(() => {
                const product = createMockProduct(activeOrder);
                simulation.dispatch({ type: 'FINISH_MANUFACTURING', product });
                setActiveOrder(null);
            }, 1500); // 1.5s manufacturing pipeline
            return () => clearTimeout(timer);
        }
    }, [state.isManufacturing, activeOrder, simulation]);

    const handleOrder = (type: ProductType) => {
        if (state.isManufacturing) return;
        setActiveOrder(type);
        simulation.dispatch({ type: 'ORDER_PRODUCT', productType: type });
    };

    const getShapeClasses = (type: ProductType) => {
        switch (type) {
            case 'SQUARE': return 'rounded-md w-10 h-10';
            case 'CIRCLE': return 'rounded-full w-10 h-10';
            case 'TRIANGLE': return 'w-0 h-0 border-l-[20px] border-r-[20px] border-b-[34.6px] border-l-transparent border-r-transparent bg-transparent';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-8">
            {/* Visual Canvas Area */}
            <div className="flex-1 px-8 relative flex flex-col items-center justify-between py-12">

                {/* Factory Engine */}
                <div className="relative w-64 h-40 border-2 border-gray-700 bg-dark-panel rounded-2xl flex flex-col items-center justify-center shadow-lg overflow-hidden group">

                    <div className="absolute top-2 left-4 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <motion.div
                            animate={{ backgroundColor: state.isManufacturing ? '#10b981' : '#374151' }}
                            className="w-2 h-2 rounded-full"
                        />
                    </div>

                    <h4 className="text-gray-300 font-bold mb-2">Creator Factory</h4>
                    <div className="text-xs text-gray-500 text-center uppercase tracking-widest font-mono">
                        {state.isManufacturing ? 'Assembling...' : 'Awaiting Order'}
                    </div>

                    {/* Internal Manufacturing Animation */}
                    <div className="absolute bottom-0 w-full h-1 bg-gray-800">
                        {state.isManufacturing && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, ease: 'linear' }}
                                className="h-full"
                                style={{ backgroundColor: activeOrder ? getProductColor(activeOrder) : '#fff' }}
                            />
                        )}
                    </div>

                    {/* Assembly Line Exit Point Overlay */}
                    <div className="absolute -bottom-1 w-12 h-2 rounded-t-lg bg-gray-900 mx-auto" />
                </div>

                {/* Conveyor Belt / Inventory */}
                <div className="w-full h-32 mt-12 border border-gray-800/50 bg-[#0a0a0a] rounded-xl flex items-center px-4 overflow-x-auto gap-4 relative">
                    <div className="absolute bottom-4 w-[200%] h-1 opacity-20" style={{ background: 'repeating-linear-gradient(90deg, #374151, #374151 10px, transparent 10px, transparent 20px)' }} />

                    <AnimatePresence>
                        {state.inventory.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0, x: -50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="flex flex-col items-center justify-center shrink-0"
                            >
                                <div
                                    className={`mb-2 drop-shadow-lg ${getShapeClasses(product.type)}`}
                                    style={product.type === 'TRIANGLE' ? { borderBottomColor: product.color } : { backgroundColor: product.color }}
                                />
                                <span className="text-[10px] text-gray-500 font-mono bg-black/40 px-1 rounded">{product.id}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {state.inventory.length === 0 && <span className="text-gray-600 m-auto text-sm italic z-10">Conveyor line empty</span>}
                </div>

            </div>

            {/* Control Panel Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-200">Submit Orders</h3>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => handleOrder('SQUARE')}
                            disabled={state.isManufacturing}
                            className="flex-1 px-2 flex flex-col items-center py-4 border-blue-500/20 hover:border-blue-500"
                        >
                            <div className="w-4 h-4 bg-blue-500 rounded-sm mb-1" />
                            <span className="text-[10px] uppercase">Square</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleOrder('CIRCLE')}
                            disabled={state.isManufacturing}
                            className="flex-1 px-2 flex flex-col items-center py-4 border-red-500/20 hover:border-red-500"
                        >
                            <div className="w-4 h-4 bg-red-500 rounded-full mb-1" />
                            <span className="text-[10px] uppercase">Circle</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleOrder('TRIANGLE')}
                            disabled={state.isManufacturing}
                            className="flex-1 px-2 flex flex-col items-center py-4 border-green-500/20 hover:border-green-500"
                        >
                            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[13.8px] border-l-transparent border-r-transparent border-b-green-500 mb-1" />
                            <span className="text-[10px] uppercase">Triangle</span>
                        </Button>
                    </div>

                    <div className="h-px bg-gray-800 my-2" />

                    <Button
                        variant="danger"
                        onClick={() => simulation.dispatch({ type: 'CLEAR_INVENTORY' })}
                        disabled={state.isManufacturing || state.inventory.length === 0}
                    >
                        Clear Conveyor
                    </Button>
                </div>

                {/* Logs Area */}
                <div className="h-80 shrink-0 bg-dark-panel border border-gray-800 rounded-xl p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-200 mb-3 text-sm flex justify-between">
                        Runtime Logs
                        <span className="text-gray-500 font-normal">Produced: {state.totalProduced}</span>
                    </h3>
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
