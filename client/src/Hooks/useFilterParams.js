import { useSearchParams } from 'react-router-dom';

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilters = (newFilters) => {
    const currentParams = new URLSearchParams(searchParams);
    
    // Update the current parameters with the new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    
    // every change resets pages to 1.
    if (!newFilters.page) {
      currentParams.set('page', '1');
    }

    // Update the URL with the new query parameters
    setSearchParams(currentParams, { replace: true });
  };

  return {
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    category: searchParams.get('category') || '',
    page: parseInt(searchParams.get('page'), 10) || 1,
    updateFilters
  };
};