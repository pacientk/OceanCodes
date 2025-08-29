import React from 'react';
import { Search, Users } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-data' | 'no-results';
  searchQuery?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery }) => {
  const isNoResults = type === 'no-results';

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {isNoResults ? (
        <Search className="w-16 h-16 text-gray-400 mb-4" />
      ) : (
        <Users className="w-16 h-16 text-gray-400 mb-4" />
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isNoResults ? 'No search results' : 'No data available'}
      </h3>

      <p className="text-gray-600">
        {isNoResults
          ? `No results found for "${searchQuery}". Try adjusting your search terms.`
          : 'There are currently no items to display.'}
      </p>
    </div>
  );
};

export default EmptyState;
