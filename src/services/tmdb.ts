import axios from 'axios';

// Try hardcoded key temporarily
const API_KEY = "410f1631"; // import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

// Create axios instance
const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Genre?: string;
  imdbRating?: string;
  Released?: string;
  Runtime?: string;
  Awards?: string;
  Country?: string;
  Language?: string;
  Rated?: string;
  Writer?: string;
  totalSeasons?: string;
  Response: string;
}

export interface SearchResponse {
  Search: OmdbMovie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Fetch details by ID
export const fetchDetails = async (id: string): Promise<OmdbMovie> => {
  try {
    const response = await omdbApi.get('', {
      params: {
        i: id,
        plot: 'full',
      },
    });
    
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'Failed to fetch details');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
};

// Search movies, shows, or both
export const searchMulti = async (query: string, page: number = 1): Promise<SearchResponse> => {
  try {
    console.log(`Searching for "${query}" on page ${page}`);
    
    const response = await omdbApi.get('', {
      params: {
        s: query,
        page,
      },
    });
    
    if (response.data.Response === 'False') {
      console.log('API returned False response:', response.data.Error);
      throw new Error(response.data.Error || 'No results found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
};

// Search by specific type (movie, series, episode)
export const searchByType = async (
  query: string, 
  type: 'movie' | 'series' | 'episode', 
  page: number = 1
): Promise<SearchResponse> => {
  try {
    const response = await omdbApi.get('', {
      params: {
        s: query,
        type,
        page,
      },
    });
    
    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No results found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error searching ${type}:`, error);
    throw error;
  }
};

// Get trending/popular content (simulated by generic searches since OMDb doesn't have trending endpoints)
export const fetchTrending = async (mediaType: 'movie' | 'series' | 'all' = 'all'): Promise<OmdbMovie[]> => {
  console.group(`fetchTrending (${mediaType})`);
  try {
    console.log("API Key:", API_KEY);
    console.log("API Base URL:", BASE_URL);
    
    // Test if we're in dev mode
    console.log("In DEV mode:", import.meta.env.DEV);
    
    // FOR TESTING: Force fallback data
    if (true) { // Change to true to force fallback
      console.log("Using FORCED fallback movie data");
      console.groupEnd();
      return [
        {
          Title: "The Shawshank Redemption",
          Year: "1994",
          imdbID: "tt0111161",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
          Response: "True"
        },
        {
          Title: "The Godfather",
          Year: "1972",
          imdbID: "tt0068646",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
          Response: "True"
        },
        {
          Title: "The Dark Knight",
          Year: "2008",
          imdbID: "tt0468569",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
          Response: "True"
        },
        {
          Title: "Pulp Fiction",
          Year: "1994",
          imdbID: "tt0110912",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
          Response: "True"
        },
        {
          Title: "Inception",
          Year: "2010",
          imdbID: "tt1375666",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
          Response: "True"
        }
      ];
    }
    
    const searchTerms = ['action', 'drama', 'adventure', 'comedy'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const params: Record<string, string | number> = {
      s: randomTerm,
      page: 1,
    };
    
    if (mediaType !== 'all') {
      params.type = mediaType;
    }
    
    console.log("Request params:", params);
    
    try {
      // Test API directly with fetch to bypass axios
      console.log("Testing direct fetch API call...");
      const testUrl = `${BASE_URL}?apikey=${API_KEY}&s=batman`;
      console.log("Test URL:", testUrl);
      
      const testResponse = await fetch(testUrl);
      const testData = await testResponse.json();
      console.log("Direct fetch test response:", testData);
    } catch (testError) {
      console.error("Direct fetch test failed:", testError);
    }
    
    console.log("Making axios request...");
    const response = await omdbApi.get('', { params });
    console.log("Axios response:", response);
    
    if (response.data.Response === 'False') {
      console.warn("API returned 'False' response:", response.data.Error);
      console.groupEnd();
      return [];
    }
    
    console.log("Movies retrieved:", response.data.Search?.length);
    console.groupEnd();
    return response.data.Search || [];
  } catch (error) {
    console.error("Error in fetchTrending:", error);
    console.groupEnd();
    return [];
  }
};

// Simulate fetchPopular since OMDb doesn't have this endpoint
export const fetchPopular = async (mediaType: 'movie' | 'series' = 'movie', page: number = 1): Promise<OmdbMovie[]> => {
  try {
    // Popular titles vary by genre, so we'll use a generic term
    const response = await omdbApi.get('', {
      params: {
        s: mediaType === 'movie' ? 'popular' : 'show',
        type: mediaType,
        page,
      },
    });
    
    if (response.data.Response === 'False') {
      return [];
    }
    
    return response.data.Search;
  } catch (error) {
    console.error(`Error fetching popular ${mediaType}:`, error);
    return [];
  }
};

// Simulate fetchTopRated
export const fetchTopRated = async (mediaType: 'movie' | 'series' = 'movie', page: number = 1): Promise<OmdbMovie[]> => {
  try {
    // Use "award" as a search term to try to get highly-rated content
    const response = await omdbApi.get('', {
      params: {
        s: 'award',
        type: mediaType,
        page,
      },
    });
    
    if (response.data.Response === 'False') {
      return [];
    }
    
    return response.data.Search;
  } catch (error) {
    console.error(`Error fetching top rated ${mediaType}:`, error);
    return [];
  }
};

// Get movies by genre (simulate since OMDb doesn't have genre endpoints)
export const fetchByGenre = async (genre: string, mediaType: 'movie' | 'series' = 'movie', page: number = 1): Promise<OmdbMovie[]> => {
  try {
    // Use the genre name as the search term
    const response = await omdbApi.get('', {
      params: {
        s: genre,
        type: mediaType,
        page,
      },
    });
    
    if (response.data.Response === 'False') {
      return [];
    }
    
    return response.data.Search;
  } catch (error) {
    console.error(`Error fetching ${mediaType} by genre:`, error);
    return [];
  }
};

// Get common genres (hardcoded since OMDb doesn't have a genres endpoint)
export const fetchGenres = async () => {
  // Return common genres since OMDb doesn't have a genres endpoint
  const commonGenres = [
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'sci-fi', name: 'Science Fiction' },
    { id: 'horror', name: 'Horror' },
    { id: 'romance', name: 'Romance' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'animation', name: 'Animation' },
  ];
  
  return commonGenres;
};

// Helper function for consistent poster URL handling
export const getPosterUrl = (posterPath: string) => {
  if (!posterPath || posterPath === 'N/A') {
    return '/placeholder-poster.png'; // Replace with your placeholder image
  }
  
  // If it's already a full URL (from OMDb), return as is
  if (posterPath.startsWith('http')) {
    return posterPath;
  }
  
  // For backward compatibility - mimic TMDB behavior but just return the full URL
  return posterPath;
};

// Add these constants to provide compatibility with components expecting TMDB-style image configuration
export const backdropSizes = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
};

export const posterSizes = {
  small: 'w154',
  medium: 'w342',
  large: 'w500',
  xlarge: 'w780',
  original: 'original'
};

export const profileSizes = {
  small: 'w45',
  medium: 'w185',
  large: 'h632',
  original: 'original'
};

// Add a new function for backdrop images
export const getBackdropUrl = (backdropPath: string) => {
  if (!backdropPath || backdropPath === 'N/A') {
    return '/placeholder-backdrop.png'; // Replace with your placeholder backdrop image
  }
  
  // For OMDb, we can use the poster as backdrop since OMDb doesn't provide backdrop images
  return backdropPath;
};

// Movie details alias for compatibility with existing code
export const fetchMovieDetails = async (imdbId: string) => {
  return fetchDetails(imdbId);
};

// TV details alias for compatibility with existing code
export const fetchTvDetails = async (imdbId: string) => {
  return fetchDetails(imdbId);
};

// Movie by genre alias
export const fetchMoviesByGenre = async (genre: string, page: number = 1) => {
  return fetchByGenre(genre, 'movie', page);
};

// TV by genre alias
export const fetchTvByGenre = async (genre: string, page: number = 1) => {
  return fetchByGenre(genre, 'series', page);
};

export default omdbApi;