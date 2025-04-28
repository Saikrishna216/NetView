import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { getBackdropUrl } from '../services/tmdb'; // Adjust the import path as necessary

interface HeroProps {
  title: string;
  overview: string;
  imageUrl: string;
  id: string;
  type?: 'movie' | 'tv';
}

const Hero: React.FC<HeroProps> = ({ title, overview, imageUrl, id, type = 'movie' }) => {
  // Fix: Remove the second argument if your getBackdropUrl doesn't accept it
  const backdropUrl = getBackdropUrl(imageUrl);
  
  // OR update the function in your tmdb.ts file to accept the size parameter:
  // export const getBackdropUrl = (backdropPath: string, size?: string) => {
  //   if (!backdropPath || backdropPath === 'N/A') {
  //     return '/placeholder-backdrop.png';
  //   }
  //   return backdropPath;
  // };

  return (
    <div className="relative h-[80vh] min-h-[500px]">
      {/* Backdrop Image */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-5xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{title}</h1>
        <p className="text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 max-w-2xl">
          {overview}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to={`/watch/${id}?type=${type}`}
            className="bg-netflix-red hover:bg-red-700 text-white font-medium px-6 py-2 rounded flex items-center gap-2"
          >
            <Play size={20} /> 
            <span>Play</span>
          </Link>
          <Link
            to={`/${type}/${id}`}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded flex items-center gap-2"
          >
            <Info size={20} />
            <span>More Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;