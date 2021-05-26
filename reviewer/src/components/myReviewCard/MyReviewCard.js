import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import { Link } from 'react-router-dom';

import './myReviewCard.css';
import { MdOpenInNew } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { MdFlip } from 'react-icons/md';
import ReactCardFlip from 'react-card-flip';

import emptyStar from '../../assets/img/empty-star.svg';
import fillStar from '../../assets/img/fill-star.svg';
import ReviewCardFull from '../reviewCardFull';
import RemoveCard from '../removeCard';

export default function MyReviewCard({
  el,
  category,
  style = {},
  updateUserReviews,
}) {
  const [showFull, setShowFull] = useState(null);
  const [deleteReview, setDeleteReview] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  let authorsFieldName, categoryName;

  switch (category) {
    case 'movies':
      [authorsFieldName, categoryName] = ['directors', 'film'];
      break;
    case 'books':
      [authorsFieldName, categoryName] = ['authors', 'book'];
      break;
    case 'games':
      [authorsFieldName, categoryName] = ['developers', 'game'];
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

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div>
      {showFull && (
        <ReviewCardFull
          el={el}
          authorsFieldName={authorsFieldName}
          getRating={getRating}
          getReviewDate={getReviewDate}
          onClickClose={() => setShowFull(false)}
        />
      )}

      {deleteReview && (
        <RemoveCard
          id={el.id}
          onClickClose={() => setDeleteReview(false)}
          updateUserReviews={updateUserReviews}
          category={categoryName}
        />
      )}

      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div key="front">
          <div className="review-item" style={style}>
            <h4 className="review-item__heading">{el.title}</h4>
            {el.localTitle && (
              <h4 className="review-item__heading review-item__heading__original">
                ({el.localTitle})
              </h4>
            )}
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
            <p className="review-item__text">{el.description}</p>
            <div className="review-item__date__container">
              <p className="review-item__date">
                {getReviewDate(el.creationDate)}
              </p>
              {el.viewed && (
                <p className="review-item__viewed">Повторное ознакомление</p>
              )}
            </div>
            <MdFlip
              size="1.5em"
              className="icon-flip"
              onClick={handleCardClick}
            />
          </div>
        </div>

        <div key="back">
          <div className="review-item review-item__back" style={style}>
            <MdOpenInNew
              size="2.5em"
              className="review-item__control"
              onClick={() => setShowFull(true)}
              color="#5bc0de"
            />
            <Link
              to={{
                pathname: `/home/${category}/my-reviews/edit`,
                el,
              }}
            >
              <MdEdit
                size="2.5em"
                className="review-item__control"
                color="#0275d8"
              />
            </Link>
            <MdDelete
              size="2.5em"
              className="review-item__control"
              color="#d9534f"
              onClick={() => setDeleteReview(true)}
            />
            <MdFlip
              size="1.5em"
              className="icon-flip"
              onClick={handleCardClick}
            />
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
}
