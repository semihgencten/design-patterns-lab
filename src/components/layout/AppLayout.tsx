import { Link, Outlet } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { LayoutDashboard, Award } from 'lucide-react';

export function AppLayout() {
    const { xp } = useAppStore();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="h-16 border-b border-gray-800 bg-dark-panel flex items-center justify-between px-6">
                <Link to="/" className="text-xl font-bold text-primary-purple flex items-center gap-2">
                    <LayoutDashboard size={24} />
                    <span>PatternLab</span>
                </Link>
                <div className="flex items-center gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full">
                        <Award size={16} />
                        <span>{xp} XP</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 flex overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
