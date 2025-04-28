import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserProfile } from '../services/userService';
import Logo from '../components/Logo';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.name);
      
      // Initialize user profile in Firestore
      const userData = {
        displayName: formData.name,
        email: formData.email,
      };
      
      await createUserProfile(formData.email, userData);
      
      navigate('/');
    } catch (err) {
      setError('Failed to create an account');
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
        <h1 className="text-3xl font-bold text-white mb-8">Sign Up</h1>
        
        {error && (
          <div className="mb-4 bg-red-900/60 text-white p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-netflix-red text-white rounded font-medium hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-netflix-red disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-gray-400 flex items-center">
          <span>Already have an account?</span>
          <Link to="/login" className="ml-2 text-white hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;