import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, onChange = null, max = 5, readOnly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`transition-colors p-0.5 rounded focus:outline-none ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
            }`}
          >
            <Star
              className={`${starSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
