import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGate from '@/components/AuthGate';
import Dashboard from '@/pages/Dashboard';
import ServicesPage from '@/pages/ServicesPage';
import InfrastructurePage from '@/pages/InfrastructurePage';
import LogsPage from '@/pages/LogsPage';

export default function App() {
    return (
        <AuthGate>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/infrastructure" element={<InfrastructurePage />} />
                    <Route path="/logs" element={<LogsPage />} />
                </Routes>
            </BrowserRouter>
        </AuthGate>
    );
}
