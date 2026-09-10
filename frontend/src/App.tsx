import {BrowserRouter, Routes , Route , Navigate} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './lib/auth';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <ProjectsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/projects" replace />} />
                  </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
        )}