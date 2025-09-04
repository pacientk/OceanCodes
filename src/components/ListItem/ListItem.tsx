import { Reviewer, User } from '../../types';
import { memo } from 'react';

interface ListItemProps {
  item: User | Reviewer;
  type?: 'user' | 'reviewer';
  maxCommentLength?: number;
}

const truncateText = (text: string, maxLength: number = 120): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const ListItem = memo<ListItemProps>(({ item, type, maxCommentLength = 120 }) => {
  const fullName = `${item.firstName} ${item.lastName}`;
  const truncatedComments = truncateText(item.comments, maxCommentLength);

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="space-y-2.5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{fullName}</h3>
          {type && (
            <span className="text-xs text-gray-400 font-medium capitalize shrink-0 ml-2">
              {type}
            </span>
          )}
        </header>

        <div className="text-sm text-gray-600">
          <p className="font-medium truncate" title={item.email}>
            {item.email}
          </p>
        </div>

        <div className="text-sm">
          <p className="text-blue-600 font-medium italic">&quot;{item.catchPhrase}&quot;</p>
        </div>

        <div className="text-sm text-gray-700">
          <p title={item.comments.length > maxCommentLength ? item.comments : undefined}>
            {truncatedComments}
          </p>
        </div>
      </div>
    </article>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
