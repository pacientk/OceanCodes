import { memo } from 'react';
import { Inbox, Search, Users } from 'lucide-react';

type EmptyStateType = 'no-data' | 'no-results' | 'loading';

interface EmptyStateProps {
  type: EmptyStateType;
  searchQuery?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

interface EmptyStateConfig {
  icon: typeof Search;
  title: string;
  description: string;
}

const EmptyState = memo<EmptyStateProps>(
  ({ type, searchQuery, title, description, variant = 'default', className = '' }) => {
    const configs: Record<EmptyStateType, EmptyStateConfig> = {
      'no-data': {
        icon: Users,
        title: title || 'No data available',
        description: description || 'There are currently no items to display.',
      },
      'no-results': {
        icon: Search,
        title: title || 'No search results',
        description:
          description ||
          (searchQuery
            ? 'No results found. Try adjusting your search terms.'
            : 'No results found. Try different search terms.'),
      },
      loading: {
        icon: Inbox,
        title: title || 'Loading...',
        description: description || 'Please wait while we fetch your data.',
      },
    };

    const config = configs[type];
    const Icon = config.icon;

    const isCompact = variant === 'compact';
    const iconSize = isCompact ? 'w-12 h-12' : 'w-16 h-16';
    const padding = isCompact ? 'p-8' : 'p-12';
    const titleSize = isCompact ? 'text-base' : 'text-lg';
    const descriptionSize = isCompact ? 'text-sm' : 'text-base';

    return (
      <div
        className={`
        flex flex-col items-center justify-center text-center
        ${padding} ${className}
      `.trim()}
        role="status"
        aria-live="polite"
      >
        <Icon className={`${iconSize} text-gray-400 mb-4`} aria-hidden="true" />

        <h3 className={`${titleSize} font-semibold text-gray-900 mb-2`}>{config.title}</h3>

        <p className={`text-gray-600 max-w-md ${descriptionSize}`}>{config.description}</p>

        {/* Optional search query highlight for better UX */}
        {type === 'no-results' && searchQuery && (
          <div className="mt-3 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
            Searched for: <span className="font-medium">{searchQuery}</span>
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
