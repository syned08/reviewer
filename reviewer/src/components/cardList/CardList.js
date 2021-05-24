import React from 'react';
import './cardList.css';

import ReviewCard from '../reviewCard';
import MyReviewCard from '../myReviewCard';

export default function CardList({
  data,
  category,
  myReviews = false,
  updateUserReviews = null,
}) {
  return (
    <div className="reviews-wrapper">
      {data.map(el => {
        return myReviews ? (
          <MyReviewCard
            el={el}
            category={category}
            key={el.id}
            updateUserReviews={updateUserReviews}
          />
        ) : (
          <ReviewCard el={el} category={category} key={el.id} />
        );
      })}
    </div>
  );
}
