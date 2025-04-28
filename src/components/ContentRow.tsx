import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { OmdbMovie } from '../services/tmdb';



interface ContentRowProps {
  title: string;
  movies: OmdbMovie[];
  loading?: boolean;
  error?: string;
}

const ContentRow: React.FC<ContentRowProps> = ({ 
  title, 
  movies, 
  loading = false,
  error = ''
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Debug received props
  useEffect(() => {
    console.log(`ContentRow "${title}" received:`, { 
      movieCount: movies?.length || 0, 
      loading, 
      error 
    });
  }, [title, movies, loading, error]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      // Show left arrow if scrolled to the right
      setShowLeftArrow(scrollLeft > 0);
      // Hide right arrow if reached the end
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };
  
  // Check scroll arrows on mount and window resize
  useEffect(() => {
    const checkArrows = () => handleScroll();
    
    // Check on mount
    checkArrows();
    
    // Check on window resize
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [movies]);

  // Show loading state
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>
        <div className="flex space-x-2 px-4 md:px-8 overflow-x-auto">
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`} className="w-36 md:w-48 h-56 md:h-72 bg-gray-800 rounded animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>
        <div className="text-red-500 px-4 md:px-8">{error}</div>
      </div>
    );
  }
  
  // Don't render if no movies
  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    console.log(`ContentRow "${title}": No movies to display`);
    
    // Add fallback display for development
    if (import.meta.env.DEV) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>
          <div className="px-4 md:px-8 text-gray-400">
            No content available. Check API configuration.
          </div>
        </div>
      );
    }
    
    return null;
  }

  return (
    <div className="mb-8 group/row">
      <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>
      <div className="relative">
        {showLeftArrow && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div 
          ref={sliderRef}
          className="flex space-x-2 px-4 md:px-8 overflow-x-auto scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => {
            // Verify movie object has required properties
            if (!movie || !movie.imdbID) {
              console.warn('ContentRow: Invalid movie object:', movie);
              return null;
            }
            
            return (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
              />
            );
          })}
        </div>
        
        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;