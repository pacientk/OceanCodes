import React, { KeyboardEvent, memo, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
  'aria-label'?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = memo<SearchInputProps>(
  ({
    value,
    onChange,
    onClear,
    loading = false,
    placeholder = 'Search...',
    disabled = false,
    variant = 'default',
    className = '',
    'aria-label': ariaLabel,
    onFocus,
    onBlur,
    onKeyDown,
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      onClear();
      inputRef.current?.focus();
    }, [onClear]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' && value) {
          handleClear();
          e.preventDefault();
        }
        onKeyDown?.(e);
      },
      [value, handleClear, onKeyDown]
    );

    const isCompact = variant === 'compact';
    const inputHeight = isCompact ? 'py-1.5' : 'py-2';
    const iconSize = isCompact ? 'h-4 w-4' : 'h-5 w-5';
    const leftPadding = isCompact ? 'pl-8' : 'pl-10';
    const rightPadding = loading || value ? 'pr-12' : 'pr-3';

    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`${iconSize} text-gray-400`} aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel || placeholder}
          className={`
          block w-full ${leftPadding} ${rightPadding} ${inputHeight}
          border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          placeholder:text-gray-400
          transition-colors duration-200
          outline-none
        `.trim()}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {loading && <LoadingSpinner size="small" aria-label="Searching..." />}

          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={`
              text-gray-400 hover:text-gray-600 focus:text-gray-600
              hover:bg-gray-100 focus:bg-gray-100 rounded p-0.5
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-colors duration-150
            `.trim()}
              aria-label="Clear search"
              tabIndex={0}
            >
              <X className={iconSize} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
