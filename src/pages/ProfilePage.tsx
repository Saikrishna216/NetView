import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';
import MovieCard from '../components/MovieCard';
import { ArrowLeft } from 'lucide-react';

interface UserProfile {
  displayName: string;
  email: string;
  favorites: any[];
  watchlist: any[];
}

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watchlist');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userData = await getUserProfile(currentUser.uid);
        setProfile(userData as UserProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="bg-netflix-black min-h-screen pt-20 flex justify-center">
        <div className="loader border-t-4 border-netflix-red rounded-full border-4 border-t-netflix-red border-gray-800 h-12 w-12 animate-spin mt-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-netflix-black min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={goBack}
          className="text-white hover:text-gray-300 transition mb-6 flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center">
            <img
              src={currentUser.photoURL || 'https://i.pravatar.cc/150?img=12'}
              alt="Profile"
              className="w-20 h-20 rounded-full mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{profile?.displayName || currentUser.displayName}</h1>
              <p className="text-gray-400">{profile?.email || currentUser.email}</p>
            </div>
            <div className="ml-auto mt-4 sm:mt-0">
              <button
                onClick={handleLogout}
                className="bg-netflix-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-4 px-6 text-lg font-medium ${
                activeTab === 'watchlist' ? 'text-white border-b-2 border-netflix-red' : 'text-gray-400'
              }`}
            >
              My List
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-6 text-lg font-medium ${
                activeTab === 'favorites' ? 'text-white border-b-2 border-netflix-red' : 'text-gray-400'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {activeTab === 'watchlist' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">My List</h2>
            {profile?.watchlist && profile.watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {profile.watchlist.map((item) => (
                  <MovieCard key={`watchlist-${item.id}`} media={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-xl">Your watchlist is empty</p>
                <p className="mt-2">Add movies and TV shows to your list to watch later</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Favorites</h2>
            {profile?.favorites && profile.favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {profile.favorites.map((item) => (
                  <MovieCard key={`favorite-${item.id}`} media={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-xl">You haven't liked any titles yet</p>
                <p className="mt-2">Click the like button on any movie or TV show</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;