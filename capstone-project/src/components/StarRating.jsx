import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.round(rating) ? '#fbbf24' : 'none'}
          stroke={star <= Math.round(rating) ? '#fbbf24' : '#d1d5db'}
        />
      ))}
    </div>
  );
};

export default StarRating;
