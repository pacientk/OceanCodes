import { AlertCircle, RefreshCw } from 'lucide-react';
import { memo, useCallback } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
  className?: string;
}

const ErrorMessage = memo<ErrorMessageProps>(
  ({ message, onRetry, variant = 'default', showIcon = true, className = '' }) => {
    const handleRetry = useCallback(() => {
      onRetry?.();
    }, [onRetry]);

    const isCompact = variant === 'compact';
    const iconSize = isCompact ? 'w-8 h-8' : 'w-12 h-12';
    const spacing = isCompact ? 'p-4' : 'p-6';
    const textSize = isCompact ? 'text-sm' : 'text-base';
    const buttonSize = isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';

    return (
      <div
        className={`
        flex flex-col items-center justify-center text-center
        ${spacing} ${className}
      `.trim()}
        role="alert"
        aria-live="polite"
      >
        {showIcon && <AlertCircle className={`${iconSize} text-red-500 mb-3`} aria-hidden="true" />}

        <p className={`text-gray-600 ${isCompact ? 'mb-3' : 'mb-4'} ${textSize}`}>{message}</p>

        {onRetry && (
          <button
            onClick={handleRetry}
            type="button"
            className={`
            ${buttonSize} bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-colors duration-200 inline-flex items-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
          `.trim()}
            aria-label={`Retry: ${message}`}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
