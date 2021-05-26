import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import './reviewCard.css';
import { MdOpenInNew } from 'react-icons/md';

import emptyStar from '../../assets/img/empty-star.svg';
import fillStar from '../../assets/img/fill-star.svg';
import ReviewCardFull from '../reviewCardFull';

export default function ReviewCard({ el, category, style = {} }) {
  const [showFull, setShowFull] = useState(null);
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
      {showFull && (
        <ReviewCardFull
          el={el}
          authorsFieldName={authorsFieldName}
          getRating={getRating}
          getReviewDate={getReviewDate}
          onClickClose={() => setShowFull(false)}
        />
      )}
      <h4 className="review-item__heading">{el.title}</h4>
      {el.localTitle && (
        <h4 className="review-item__heading review-item__heading__original">
          ({el.localTitle})
        </h4>
      )}
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
        {el.viewed && (
          <p className="review-item__viewed">Повторное ознакомление</p>
        )}
      </div>
      <MdOpenInNew
        size="1.5em"
        className="show__full"
        onClick={() => setShowFull(true)}
      />
    </div>
  );
}
