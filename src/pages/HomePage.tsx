import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { 
  fetchTrending, 
  fetchPopular, 
  fetchTopRated, 
  fetchByGenre, 
  OmdbMovie 
} from '../services/tmdb';// Add this for debugging

const HomePage: React.FC = () => {
  const [heroMovie, setHeroMovie] = useState<OmdbMovie | null>(null);
  const [trendingNow, setTrendingNow] = useState<OmdbMovie[]>([]);
  const [popularMovies, setPopularMovies] = useState<OmdbMovie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<OmdbMovie[]>([]);
  const [popularShows, setPopularShows] = useState<OmdbMovie[]>([]);
  const [actionMovies, setActionMovies] = useState<OmdbMovie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching trending data...");
        const trending = await fetchTrending('all');
        console.log("Trending data:", trending);
        setTrendingNow(trending);
        
        // Set random trending item as hero
        if (trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length));
          setHeroMovie(trending[randomIndex]);
        }
        
        // Fetch other categories
        console.log("Fetching other categories...");
        const popular = await fetchPopular('movie');
        const topRated = await fetchTopRated('movie');
        const shows = await fetchPopular('series');
        const action = await fetchByGenre('action', 'movie');
        const comedy = await fetchByGenre('comedy', 'movie');
        
        console.log("Categories fetched:", {
          popularCount: popular.length,
          topRatedCount: topRated.length,
          showsCount: shows.length,
          actionCount: action.length,
          comedyCount: comedy.length
        });
        
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setPopularShows(shows);
        setActionMovies(action);
        setComedyMovies(comedy);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Manually define a hero movie if none is available from API
  const fallbackHero = {
    Title: "The Shawshank Redemption",
    Year: "1994",
    imdbID: "tt0111161",
    Type: "movie",
    Poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    Response: "True"
  };

  return (
    <div className="bg-netflix-black min-h-screen">
      {/* Hero Component - updated props for OMDb structure */}
      {heroMovie && (
        <Hero 
          title={heroMovie.Title}
          overview={heroMovie.Plot || "No overview available."}
          imageUrl={heroMovie.Poster}
          id={heroMovie.imdbID}
          type={heroMovie.Type === 'series' ? 'tv' : 'movie'}
        />
      )}
      
      {/* Fallback Hero if no heroMovie available */}
      {!heroMovie && !loading && (
        <Hero 
          title={fallbackHero.Title}
          overview={fallbackHero.Plot || ""}
          imageUrl={fallbackHero.Poster}
          id={fallbackHero.imdbID}
          type="movie"
        />
      )}
      
      <div className="pt-4 pb-16">
        <ContentRow title="Trending Now" movies={trendingNow} loading={loading} error={error} />
        <ContentRow title="Popular Movies" movies={popularMovies} loading={loading} error={error} />
        <ContentRow title="Top Rated" movies={topRatedMovies} loading={loading} error={error} />
        <ContentRow title="Popular TV Shows" movies={popularShows} loading={loading} error={error} />
        <ContentRow title="Action & Adventure" movies={actionMovies} loading={loading} error={error} />
        <ContentRow title="Comedies" movies={comedyMovies} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default HomePage;