import React from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import './reviewCard.css';

import emptyStar from '../../assets/img/empty-star.svg';
import fillStar from '../../assets/img/fill-star.svg';

export default function ReviewCard({ el, category, style = {} }) {
  let authorsFieldName = '';

  switch (category) {
    case 'movies':
      authorsFieldName = 'directors';
      break;
    case 'books':
      authorsFieldName = 'authors';
      break;
    case 'games':
      authorsFieldName = 'developers';
      break;
    default:
      break;
  }

  const getRating = nmb => {
    const array = new Array(10).fill(0);
    return array.fill(1, 0, nmb + 1);
  };

  const getReviewDate = creationDate => {
    return moment(creationDate).fromNow();
  };

  return (
    <div className="review-item" style={style}>
      <h4 className="review-item__heading">{el.title}</h4>
      <div className="review-item__rating">
        {getRating(el.rating).map((el, i) => {
          const imgName = el === 1 ? fillStar : emptyStar;
          return <img src={imgName} alt="star" key={i} className="star-item" />;
        })}
      </div>
      <div className="review-item__gay">
        <p className="review-item__author">{el[authorsFieldName].join(', ')}</p>
        <p className="review-item__genre">Жанр: {el.genre.join(', ')}</p>
        <p className="review-item__year">Год: {el.year}</p>
      </div>
      <p className="review-item__text">{el.description}</p>
      <div className="review-item__date__container">
        <p className="review-item__date">{getReviewDate(el.creationDate)}</p>
      </div>
    </div>
  );
}
