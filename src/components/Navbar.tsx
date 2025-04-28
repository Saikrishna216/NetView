import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input
      if (mobileMenuOpen) {
        setMobileMenuOpen(false); // Close mobile menu if open
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isTransparent = location.pathname === '/' && !isScrolled;

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-netflix-black shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <Logo />
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/browse/movies" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Movies
                </Link>
                <Link to="/browse/tv" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  TV Shows
                </Link>
                <Link to="/browse/mylist" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My List
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative max-w-md w-full">
              <input
                type="search"
                placeholder="Search for movies or TV shows"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center text-gray-300 hover:text-white">
                  <img 
                    src={currentUser.photoURL || 'https://i.pravatar.cc/150?img=12'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-md"
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-netflix-black rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-white bg-netflix-red px-4 py-1 rounded-md font-medium">
                Sign In
              </Link>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/browse/movies" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Movies
            </Link>
            <Link to="/browse/tv" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              TV Shows
            </Link>
            <Link to="/browse/mylist" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              My List
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <form onSubmit={handleSearch} className="px-4 mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-gray-900 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-netflix-red"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            {currentUser ? (
              <div className="px-4">
                <Link to="/profile" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-4">
                <Link to="/login" className="block text-center text-white bg-netflix-red px-4 py-2 rounded-md font-medium">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;