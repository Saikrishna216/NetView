import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, Info } from 'lucide-react';
import { OmdbMovie } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';
import { addToWatchlist } from '../services/userService';

interface MovieCardProps {
  movie: OmdbMovie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentUser } = useAuth();
  
  // Fix property names for OMDb API
  const title = movie.Title || 'Untitled';
  const year = movie.Year || '';
  const mediaType = movie.Type || 'movie';
  const imdbId = movie.imdbID;
  
  // Use the getPosterUrl helper function
  const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster
    : '/placeholder-poster.png';

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentUser) {
      const mediaItem = {
        id: imdbId,
        title: title,
        poster_path: movie.Poster,
        media_type: mediaType,
        added_at: new Date().toISOString()
      };
      
      await addToWatchlist(currentUser.uid, mediaItem);
    }
  };

  // Set width based on size prop
  let cardWidth = 'w-36 sm:w-44';
  if (size === 'small') cardWidth = 'w-32 sm:w-36';
  if (size === 'large') cardWidth = 'w-48 sm:w-56';

  return (
    <Link 
      to={`/${mediaType}/${imdbId}`} 
      className={`${cardWidth} relative group transition-transform duration-300 ease-in-out transform ${isHovered ? 'scale-110 z-10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-md">
        <img 
          src={posterUrl} 
          alt={title} 
          className="w-full object-cover rounded-md transition-opacity duration-300"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-3 rounded-md">
            <h3 className="text-white font-semibold line-clamp-1">{title}</h3>
            {year && <p className="text-gray-300 text-sm">{year}</p>}
            
            <div className="flex space-x-2 mt-2">
              <button className="p-1.5 bg-white rounded-full text-black hover:bg-gray-200 transition">
                <Play size={16} fill="currentColor" />
              </button>
              <button 
                onClick={handleAddToWatchlist} 
                className="p-1.5 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition"
              >
                <Plus size={16} />
              </button>
              <button className="p-1.5 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition">
                <ThumbsUp size={16} />
              </button>
              <div className="flex-grow"></div>
              <button className="p-1.5 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition">
                <Info size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;