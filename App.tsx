import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { fetchCyberSecurityNews } from './services/geminiService';
import { Vulnerability } from './types';
import { CategorySection } from './components/CategorySection';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState('Latest Critical Vulnerabilities');

  const handleFetchNews = useCallback(async (searchTopic: string) => {
    setIsLoading(true);
    setError(null);
    setVulnerabilities([]);
    setHeaderText(searchTopic);

    try {
      const results = await fetchCyberSecurityNews(searchTopic);
      setVulnerabilities(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchNews('Latest critical vulnerabilities');
  }, [handleFetchNews]);
  
  const handleRefresh = useCallback(() => {
    setQuery('');
    handleFetchNews('Latest critical vulnerabilities');
  }, [handleFetchNews]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      handleRefresh();
      return;
    }
    handleFetchNews(query);
  }, [query, handleFetchNews, handleRefresh]);


  const groupedByCategory = vulnerabilities.reduce((acc, threat) => {
    const category = threat.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(threat);
    return acc;
  }, {} as Record<string, Vulnerability[]>);

  const categoryOrder = ['Zero-Day Vulnerability', 'CVE', 'News'];
  const categoryTitles: Record<string, string> = {
    'Zero-Day Vulnerability': 'Zero-Day Vulnerabilities',
    'CVE': 'CVEs',
    'News': 'Cybersecurity News'
  };

  const sortedCategories = Object.keys(groupedByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <p className="text-center text-gray-400 mb-4">
          An AI-powered dashboard of the latest cybersecurity threats.
        </p>

        <SearchBar 
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && !error && vulnerabilities.length === 0 && (
             <div className="text-center my-16">
                 <h2 className="text-2xl font-semibold text-gray-400">No Threats Found</h2>
                 <p className="text-gray-500 mt-2">Could not find any matching threats. Try refreshing or a different search topic.</p>
             </div>
        )}
        
        {!isLoading && vulnerabilities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mb-8 text-center sm:text-left">
                Displaying results for: <span className="text-cyan-400">{headerText}</span>
            </h2>
            {sortedCategories.map(category => (
                groupedByCategory[category].length > 0 && (
                    <CategorySection 
                        key={category} 
                        title={categoryTitles[category] || category} 
                        threats={groupedByCategory[category]} 
                    />
                )
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;