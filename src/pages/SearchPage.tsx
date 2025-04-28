import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentRow from '../components/ContentRow';
import { searchMulti, OmdbMovie } from '../services/tmdb';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        setError('');
        
        console.log(`Searching for: "${query}" (page ${page})`);
        const response = await searchMulti(query, page);
        
        if (response.Search && Array.isArray(response.Search)) {
          console.log(`Found ${response.Search.length} results`);
          setResults(response.Search);
          setTotalResults(parseInt(response.totalResults || '0', 10));
        } else {
          console.log('No results found or invalid response');
          setResults([]);
          setError('No results found for your search.');
        }
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to perform search');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const loadMoreResults = () => {
    if (results.length < totalResults) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (!query) {
    return (
      <div className="pt-24 pb-12 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Search for movies and TV shows</h2>
        <p className="text-gray-400">Enter a search term in the search bar above</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12">
      <div className="px-4 md:px-8 mb-8">
        <h1 className="text-3xl font-bold text-white">
          Search results for: <span className="text-netflix-red">"{query}"</span>
        </h1>
        {totalResults > 0 && (
          <p className="text-gray-400 mt-2">Found {totalResults} results</p>
        )}
      </div>

      {loading && results.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      ) : (
        <>
          <ContentRow 
            title="Movies & TV Shows" 
            movies={results} 
            loading={false} 
            error={error} 
          />
          
          {results.length < totalResults && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreResults}
                disabled={loading}
                className="bg-netflix-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
          
          {results.length === 0 && !loading && (
            <div className="text-center py-20 text-white">
              <p className="text-xl">No results found for "{query}"</p>
              <p className="text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;