import { Reviewer, User } from '../../types';
import React from 'react';

interface ListItemProps {
  item: User | Reviewer;
  type: 'user' | 'reviewer';
}

const ListItem: React.FC<ListItemProps> = ({ item, type }) => {
  const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {item.firstName} {item.lastName}
          </h3>
          <span className="text-xs text-gray-400 font-medium capitalize">{type}</span>
        </div>

        <div className="text-sm text-gray-600">
          <p className="font-medium">{item.email}</p>
        </div>

        <div className="text-sm">
          <p className="text-blue-600 font-medium italic">&quot;{item.catchPhrase}&quot;</p>
        </div>

        <div className="text-sm text-gray-700">
          <p>{truncateText(item.comments)}</p>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
