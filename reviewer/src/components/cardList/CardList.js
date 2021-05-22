import React from 'react';
import './cardList.css';

import ReviewCard from '../reviewCard';

export default function CardList({ data, category }) {
  return (
    <div className="reviews-wrapper">
      {data.map(el => (
        <ReviewCard el={el} category={category} key={el.id} />
      ))}
    </div>
  );
}
