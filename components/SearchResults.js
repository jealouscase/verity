'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [queryInfo, setQueryInfo] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!q) {
        setLoading(false);
        return;
      }

      try {
        console.log('Performing search for query:', q);
        setLoading(true);
        
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: q }),
        });
                
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Search request failed', { 
            cause: { 
              details: data.details,
              technicalDetails: data.technicalDetails 
            }
          });
        }
        
        const data = await response.json();
        console.log('Search completed successfully:', data);
        
        setResults(data.results || []);
        setQueryInfo(data.queryInfo || null);
        
      } catch (err) {
        console.error('Error in search:', err);
        setError(err.message || 'Failed to perform search. Please try again.');
        setErrorDetails(err.cause?.details || err.cause?.technicalDetails || null);
      } finally {
        setLoading(false);
      }
    };

    if (loading && q) {
      performSearch();
    }
  }, [q, loading]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Searching...</h1>
          <Link href="/v1" className="text-blue-600 hover:underline">
            New Search
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Search Error</h1>
          <Link href="/v1" className="text-blue-600 hover:underline">
            Try Again
          </Link>
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">{error}</h3>
          {errorDetails && (
            <p className="text-red-700 text-sm mt-2">{errorDetails}</p>
          )}
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">No Search Query</h1>
          <Link href="/v1" className="text-blue-600 hover:underline">
            Start a Search
          </Link>
        </div>
        <div className="bg-yellow-50 p-4 rounded-md">
          <p>Please enter a search query to see results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <Link href="/v1" className="text-blue-600 hover:underline">
          New Search
        </Link>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-semibold">Your Prompt</h2>
          <p className="mt-1">{q}</p>
        </div>

        {queryInfo && (
          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <h2 className="font-semibold">Generated Query</h2>
            <pre className="mt-1 text-sm overflow-x-auto whitespace-pre-wrap">
              {queryInfo.query}
            </pre>
            {queryInfo.explanation && (
              <>
                <h3 className="font-semibold mt-2">Explanation</h3>
                <p className="mt-1 text-sm">{queryInfo.explanation}</p>
              </>
            )}
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p>No matching scraps found. Try a different search prompt.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Found {results.length} matching scrap{results.length !== 1 ? 's' : ''}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {results.map((scrap) => (
              <div
                key={scrap.id}
                className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <p className="font-medium">{scrap.content}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {scrap.tags && scrap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {scrap.metadata && (
                  <div className="text-sm text-gray-600">
                    <p>
                      {scrap.metadata.tone && `Tone: ${scrap.metadata.tone}`}
                      {scrap.metadata.setting && ` • Setting: ${scrap.metadata.setting}`}
                      {scrap.metadata.era && ` • Era: ${scrap.metadata.era}`}
                    </p>
                  </div>
                )}

                {scrap.relationships && scrap.relationships.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h3 className="text-sm font-semibold mb-1">Related Scraps</h3>
                    <ul className="text-sm">
                      {scrap.relationships.map((rel, idx) => (
                        <li key={idx} className="truncate">
                          <span className="text-gray-500">{rel.type}:</span> {rel.content.substring(0, 60)}...
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;