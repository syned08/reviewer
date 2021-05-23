import React from 'react';
import './reviewCPage.css';

import ReviewForm from '../reviewForm';

export default function ReviewCPage({ category, getReviews }) {
  return (
    <section className="c-page__review" id="c-page__review">
      <div className="container">
        <h2 className="c-page__review__heading">Оставить свою рецензию:</h2>
        <ReviewForm category={category} getReviews={getReviews} />
      </div>
    </section>
  );
}
