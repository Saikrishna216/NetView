import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ArrowLeft } from 'lucide-react';
import { fetchMovieDetails, fetchTvDetails, backdropSizes } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';
import { addToWatchlist, addToFavorites } from '../services/userService';
import { MovieDetails, TvDetails } from '../types/media';

const MediaDetailsPage: React.FC = () => {
  const { id, mediaType = 'movie' } = useParams<{ id: string; mediaType: string }>();
  const [details, setDetails] = useState<MovieDetails | TvDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        
        const mediaId = parseInt(id);
        let data;
        
        if (mediaType === 'tv') {
          data = await fetchTvDetails(mediaId);
        } else {
          data = await fetchMovieDetails(mediaId);
        }
        
        if (data) {
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
    
    fetchDetails();
  }, [id, mediaType]);

  const handleAddToWatchlist = async () => {
    if (!currentUser || !details) return;
    
    const mediaItem = {
      id: details.id,
      title: 'title' in details ? details.title : details.name,
      poster_path: details.poster_path,
      media_type: mediaType,
      added_at: new Date().toISOString()
    };
    
    await addToWatchlist(currentUser.uid, mediaItem);
  };

  const handleAddToFavorites = async () => {
    if (!currentUser || !details) return;
    
    const mediaItem = {
      id: details.id,
      title: 'title' in details ? details.title : details.name,
      poster_path: details.poster_path,
      media_type: mediaType,
      added_at: new Date().toISOString()
    };
    
    await addToFavorites(currentUser.uid, mediaItem);
  };

  const goBack = () => {
    window.history.back();
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

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  const runtime = 'runtime' in details 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` 
    : details.episode_run_time && details.episode_run_time.length > 0 
      ? `${Math.floor(details.episode_run_time[0] / 60)}h ${details.episode_run_time[0] % 60}m per episode` 
      : '';

  const backdropUrl = details.backdrop_path 
    ? `${backdropSizes.large}${details.backdrop_path}` 
    : 'https://via.placeholder.com/1280x720?text=No+Image';

  // Find trailer
  const trailer = details.videos?.results.find(
    video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );

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
              {details.genres.map(genre => (
                <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded-md text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-lg text-gray-200 max-w-2xl mb-8">{details.overview}</p>
          
          <div className="flex space-x-4 flex-wrap gap-y-3">
            {trailer && (
              <a 
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black py-2 px-6 rounded-md font-semibold flex items-center hover:bg-gray-200 transition"
              >
                <Play className="mr-2" size={20} fill="currentColor" /> Watch Trailer
              </a>
            )}
            
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

      {/* Cast section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {details.credits?.cast.slice(0, 10).map(person => (
            <div key={person.id} className="bg-gray-800 rounded-md overflow-hidden">
              {person.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} 
                  alt={person.name} 
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-3">
                <p className="text-white font-medium truncate">{person.name}</p>
                <p className="text-gray-400 text-sm truncate">{person.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPage;