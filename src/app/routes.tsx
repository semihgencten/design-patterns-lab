import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { PatternPage } from '../pages/PatternPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/pattern/:id" element={<PatternPage />} />
            </Route>
        </Routes>
    );
}
