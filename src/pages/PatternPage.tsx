import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { PatternEngine } from '../core/engine/PatternRegistry';
import { ArrowLeft } from 'lucide-react';

export function PatternPage() {
    const { id } = useParams<{ id: string }>();

    const pattern = useMemo(() => {
        return id ? PatternEngine.getPattern(id) : undefined;
    }, [id]);

    const simulation = useMemo(() => {
        return pattern ? pattern.createSimulation() : null;
    }, [pattern]);

    if (!pattern || !simulation) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center w-full">
                <h2 className="text-2xl font-bold mb-4">Pattern not found</h2>
                <Link to="/" className="text-primary-blue hover:underline">Return home</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-1 w-full flex-col md:flex-row overflow-hidden">
            {/* Sidebar Info */}
            <div className="w-full md:w-80 border-r border-gray-800 bg-dark-panel p-6 flex flex-col overflow-y-auto">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </Link>
                <h1 className="text-2xl font-bold mb-2 text-white">{pattern.metadata.title}</h1>
                <p className="text-gray-400 text-sm mb-6">{pattern.metadata.description}</p>

                <div className="flex-1">
                    {/* We'll add dynamic controls here via children / slots later if needed */}
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 bg-dark-surface p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-6 left-6 z-10 text-xs font-mono text-gray-500 uppercase tracking-widest">
                    Simulation Running
                </div>
                <div className="flex-1 relative flex items-center justify-center">
                    <pattern.Visualization simulation={simulation} />
                </div>
            </div>
        </div>
    );
}
