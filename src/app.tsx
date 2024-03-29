import { useEffect, useState } from 'react';
import { GifGrid } from './components/gif-grid';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { SearchBar } from './components/search-bar';
import { TrendingSearches } from './components/trending-searches';
import { UserMenu, useAchievements } from 'dread-ui';

const App = () => {
  const [inputState, setInputState] = useState<string>(''); // State for input field
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  const { unlockAchievementById } = useAchievements();

  useEffect(() => {
    if (!searchTerm) return;
    if (trendingSearches.includes(searchTerm)) {
      unlockAchievementById('trending_search', 'gifster');
      return;
    }
    unlockAchievementById('search_gif', 'gifster');
  }, [searchTerm, unlockAchievementById, trendingSearches]);

  const apiKey = 'GZKGwdu6xlIM0iV58yFKJOFLqj0NLXFw';
  const urlBase = 'https://api.giphy.com/v1';
  const trendingSearchesUrl = `${urlBase}/trending/searches?api_key=${apiKey}`;

  useEffect(() => {
    fetch(trendingSearchesUrl)
      .then((response) => response.json())
      .then((json) => setTrendingSearches(json.data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchTermClick = (term: string) => {
    let newSearchTerm = term;
    if (term === searchTerm) newSearchTerm = '';
    setInputState(newSearchTerm); // Update input field state
    setSearchTerm(newSearchTerm); // Update search term state
  };

  return (
    <div className='flex h-full w-full flex-col items-center gap-2 overflow-auto px-8 py-12 sm:px-24 md:px-32'>
      <div className='flex w-full'>
        <div className='mx-auto flex flex-col items-center gap-2'>
          <h1>GIFster by Scott Hetrick</h1>
          <span>We're not GIPHY, damn it</span>
        </div>
        <UserMenu />
      </div>
      <SearchBar
        inputState={inputState}
        setInputState={setInputState}
        setSearchTerm={setSearchTerm}
      />
      <TrendingSearches
        trendingSearches={trendingSearches}
        searchTerm={searchTerm}
        handleSearchTermClick={handleSearchTermClick}
      />
      <div className='flex w-full flex-wrap content-start items-center gap-2 text-xl'>
        {searchTerm ? (
          <>Search: "{searchTerm}"</>
        ) : (
          <>
            <FaArrowTrendUp />
            Trending
          </>
        )}
      </div>
      <GifGrid term={searchTerm} apiKey={apiKey} />
    </div>
  );
};

export { App };
