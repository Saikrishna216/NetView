import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ArrowLeft } from 'lucide-react';
import { fetchDetails, OmdbMovie } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';
import { addToWatchlist, addToFavorites } from '../services/userService';
import { toast } from 'react-hot-toast';

/**
 * MediaDetailsPage displays detailed information about a movie or TV show
 * Compatible with OMDb API data structure
 */
const MediaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mediaType = window.location.pathname.includes('/movie/') ? 'movie' : 'tv';
  const [details, setDetails] = useState<OmdbMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Pass the detected media type to fetchDetails
        const data = await fetchDetails(id, mediaType);
        
        if (data) {
          console.log("Media details:", data);
          setDetails(data);
        } else {
          throw new Error('Failed to fetch details');
        }
      } catch (err) {
        console.error('Error fetching media details:', err);
        setError('Failed to load details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMediaDetails();
  }, [id, mediaType]);

  const handleAddToWatchlist = async () => {
    if (!currentUser || !details) return;
    
    try {
      const mediaItem = {
        id: details.imdbID,
        title: details.Title || 'Unknown Title',
        poster_path: details.Poster,
        media_type: details.Type || 'movie',
        added_at: new Date().toISOString()
      };
      
      await addToWatchlist(currentUser.uid, mediaItem);
      toast.success('Added to your watchlist');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    }
  };

  const handleAddToFavorites = async () => {
    if (!currentUser || !details) return;
    
    const mediaItem = {
      id: details.imdbID,
      title: details.Title || 'Unknown Title',
      poster_path: details.Poster,
      media_type: details.Type || 'movie',
      added_at: new Date().toISOString()
    };
    
    await addToFavorites(currentUser.uid, mediaItem);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-netflix-black min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-[40vh] w-full bg-gray-800 rounded-lg animate-pulse mb-8"></div>
          <div className="h-8 w-1/3 bg-gray-800 animate-pulse mb-4"></div>
          <div className="h-4 w-full bg-gray-800 animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-800 animate-pulse mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-800 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="bg-netflix-black min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error || 'Failed to load media details'}</p>
          <button
            onClick={goBack}
            className="bg-netflix-red text-white py-2 px-6 rounded-md inline-flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (details && (!details.Title || details.Title === 'N/A')) {
    return (
      <div className="bg-netflix-black min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-lg">
          <h2 className="text-2xl text-white mb-4">Limited Information Available</h2>
          <p className="text-gray-400 mb-6">This title has limited information in our database.</p>
          <button
            onClick={goBack}
            className="bg-netflix-red text-white py-2 px-6 rounded-md inline-flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract details using OMDb properties
  const title = details.Title || '';
  const releaseYear = details.Year || '';
  const runtime = details.Runtime || '';
  const plot = details.Plot || '';
  // Removed unused posterUrl variable
  
  // Use Poster as backdrop for OMDb (since OMDb doesn't provide backdrop images)
  const backdropUrl = details.Poster !== 'N/A' ? details.Poster : '/placeholder-backdrop.png';
  
  // Extract genres if available
  const genres = details.Genre ? details.Genre.split(',').map(genre => ({
    id: genre.trim(),
    name: genre.trim()
  })) : [];

  return (
    <div className="bg-netflix-black min-h-screen">
      {/* Hero background with gradient overlay */}
      <div className="relative w-full h-[85vh]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/70 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent z-10"></div>
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 h-full flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <button
            onClick={goBack}
            className="absolute top-8 left-4 text-white hover:text-gray-300 transition"
          >
            <ArrowLeft size={24} />
          </button>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">{title}</h1>
          
          <div className="flex items-center text-gray-300 mb-4 flex-wrap gap-y-2">
            <span className="mr-4">{releaseYear}</span>
            {runtime && <span className="mr-4">{runtime}</span>}
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded-md text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-lg text-gray-200 max-w-2xl mb-8">{plot}</p>
          
          <div className="flex space-x-4 flex-wrap gap-y-3">
            {/* OMDb doesn't provide trailer info, so we'll show a link to search for it */}
            <a 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${releaseYear} trailer`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black py-2 px-6 rounded-md font-semibold flex items-center hover:bg-gray-200 transition"
            >
              <Play className="mr-2" size={20} fill="currentColor" /> Find Trailer
            </a>
            
            <button
              onClick={handleAddToWatchlist}
              className="bg-gray-600 text-white py-2 px-6 rounded-md font-semibold flex items-center hover:bg-gray-700 transition"
            >
              <Plus className="mr-2" size={20} /> Add to My List
            </button>
            
            <button
              onClick={handleAddToFavorites}
              className="bg-gray-600 text-white py-2 px-6 rounded-md font-semibold flex items-center hover:bg-gray-700 transition"
            >
              <ThumbsUp className="mr-2" size={20} /> Like
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl text-white mb-4">Information</h3>
            <div className="space-y-3">
              {details.Director && details.Director !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Director:</span> {details.Director}
                </p>
              )}
              {details.Writer && details.Writer !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Writer:</span> {details.Writer}
                </p>
              )}
              {details.Actors && details.Actors !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Actors:</span> {details.Actors}
                </p>
              )}
              {details.Country && details.Country !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Country:</span> {details.Country}
                </p>
              )}
              {details.Language && details.Language !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Language:</span> {details.Language}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl text-white mb-4">Ratings</h3>
            <div className="space-y-3">
              {details.imdbRating && details.imdbRating !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">IMDb Rating:</span> {details.imdbRating}
                </p>
              )}
              {details.imdbVotes && details.imdbVotes !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">IMDb Votes:</span> {details.imdbVotes}
                </p>
              )}
              {details.Awards && details.Awards !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Awards:</span> {details.Awards}
                </p>
              )}
              {details.BoxOffice && details.BoxOffice !== 'N/A' && (
                <p className="text-gray-200">
                  <span className="text-gray-400">Box Office:</span> {details.BoxOffice}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPage;