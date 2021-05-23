import React from 'react';
import './reviewCardFull.css';
import { MdClose } from 'react-icons/md';

import emptyStar from '../../assets/img/empty-star.svg';
import fillStar from '../../assets/img/fill-star.svg';

export default function ReviewCardFull({
  el,
  authorsFieldName,
  getRating,
  getReviewDate,
  onClickClose,
}) {
  return (
    <div className="review-item__full__container">
      <div className="review-item__full">
        <h4 className="review-item__heading">{el.title}</h4>
        <div className="review-item__rating">
          {getRating(el.rating).map((el, i) => {
            const imgName = el === 1 ? fillStar : emptyStar;
            return (
              <img src={imgName} alt="star" key={i} className="star-item" />
            );
          })}
        </div>
        <div className="review-item__gay">
          <p className="review-item__author">
            {el[authorsFieldName].join(', ')}
          </p>
          <p className="review-item__genre">Жанр: {el.genre.join(', ')}</p>
          <p className="review-item__year">Год: {el.year}</p>
        </div>
        <p className="review-item__text__full">{el.description}</p>
        <div className="review-item__date__container">
          <p className="review-item__date">{getReviewDate(el.creationDate)}</p>
        </div>
        <MdClose
          size="1.5em"
          className="close__full"
          onClick={() => onClickClose()}
        />
      </div>
    </div>
  );
}
