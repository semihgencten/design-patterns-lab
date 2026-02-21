import { Link } from 'react-router-dom';
import { PatternEngine } from '../core/engine/PatternRegistry';

// We'll import to trigger registration (we'll do this in a central point later)

export function HomePage() {
    const patterns = PatternEngine.getAllPatterns();

    return (
        <div className="max-w-6xl mx-auto p-8 w-full overflow-y-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Interactive Design Patterns</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Don't just read about patterns. Experience them. Run simulations, observe interactions, and master software architecture.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns.map((p) => (
                    <Link
                        key={p.metadata.id}
                        to={`/pattern/${p.metadata.id}`}
                        className="group block p-6 bg-dark-panel border border-gray-800 rounded-2xl hover:border-primary-purple transition-all hover:shadow-lg hover:shadow-primary-purple/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-100 group-hover:text-primary-purple transition-colors">
                                {p.metadata.title}
                            </h2>
                            <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold 
                ${p.metadata.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {p.metadata.difficulty}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2 text-ellipsis">
                            {p.metadata.description}
                        </p>
                        <div className="flex items-center text-primary-blue text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                            Start Simulation &rarr;
                        </div>
                    </Link>
                ))}
                {patterns.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-dark-panel/50 rounded-2xl border border-gray-800 border-dashed">
                        No patterns registered yet.
                    </div>
                )}
            </div>
        </div>
    );
}
