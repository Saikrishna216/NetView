import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-black">
      <div className="absolute top-0 left-0 p-4 md:p-8">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      
      <div className="bg-black/80 p-8 sm:p-12 rounded-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>
        
        {error && (
          <div className="mb-4 bg-red-900/60 text-white p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-netflix-red text-white rounded font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-netflix-red disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-gray-400 flex items-center">
          <span>New to NetView?</span>
          <Link to="/signup" className="ml-2 text-white hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;