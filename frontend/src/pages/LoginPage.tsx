import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/projects');
        }
        catch {
            setError('Invalid email or password');
        }
    }

    return ( 
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                />
                <button 
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Sign in
                </button>
            </form>
        </div>);    
    }