import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

import './reviewForm.css';

export default function ReviewForm({ category, getReviews, el = null }) {
  const [rating, setRating] = useState(el?.rating || 6);
  const [hover, setHover] = useState(null);
  const [name, setName] = useState(el?.title || '');
  const [originalName, setOriginalName] = useState(el?.localTitle || '');
  const [authors, setAuthors] = useState(
    el?.authors || el?.directors || el?.developers || ''
  );
  const [genre, setGenre] = useState(el?.genre.join(', ') || '');
  const [year, setYear] = useState(el?.year || '');
  const [text, setText] = useState(el?.description || '');
  const [viewed, setViewed] = useState(el?.viewed || false);
  const [sending, setSending] = useState(false);
  const { currentUser } = useAuth();

  let categoryName, authorsName, yearName, authorsField, categoryField;

  switch (category) {
    case 'movies':
      [categoryName, authorsName, yearName, authorsField, categoryField] = [
        'фильма',
        'Режиссёр(ы)',
        'выпуска',
        'directors',
        'film',
      ];
      break;
    case 'games':
      [categoryName, authorsName, yearName, authorsField, categoryField] = [
        'игры',
        'Разработчик(и)',
        'выпуска',
        'developers',
        'game',
      ];
      break;
    case 'books':
      [categoryName, authorsName, yearName, authorsField, categoryField] = [
        'книги',
        'Автор(ы)',
        'издания',
        'authors',
        'book',
      ];
      break;
    default:
      break;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    setSending(true);
    let query = `https://script.google.com/macros/s/AKfycbyCzcLstQfPHLHZLYCKLHl6odOXKRuJdxQ8SSaVVEzA_hDPYOTa6uIHmJ8ZkyBsY1A0RA/exec?category=${categoryField}&add=true&title=${name}&${authorsField}=${authors}&year=${year}&genre=${genre}&rating=${rating}&description=${text}&creationDate=${Date.now()}&userEmail=${
      currentUser.email
    }&localTitle=${originalName}&viewed=${viewed}`;

    if (el) {
      query = `https://script.google.com/macros/s/AKfycbyCzcLstQfPHLHZLYCKLHl6odOXKRuJdxQ8SSaVVEzA_hDPYOTa6uIHmJ8ZkyBsY1A0RA/exec?category=${categoryField}&change=true&id=${
        el.id
      }&title=${name}&${authorsField}=${authors}&year=${year}&genre=${genre}&rating=${rating}&description=${text}&creationDate=${Date.now()}&userEmail=${
        currentUser.email
      }&localTitle=${originalName}&viewed=${viewed}`;
    }

    const res = await fetch(query, {
      method: 'POST',
    });
    const data = await res.json();
    setSending(false);

    if (data.result.includes('OK')) {
      if (el) {
        window.history.back();
      } else {
        setRating(6);
        setName('');
        setAuthors('');
        setGenre('');
        setYear('');
        setText('');
        getReviews();
      }
    }
  };

  return (
    <form className="review-form" onSubmit={e => handleSubmit(e)}>
      {sending && (
        <div className="sending">
          <h4 className="sending__heading">Отправка...</h4>
        </div>
      )}
      <fieldset>
        <label htmlFor="name">Название {categoryName}</label>
        <input
          type="text"
          name="name"
          id="review-form__name"
          required
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <label htmlFor="local-name">Оригинальное название {categoryName}</label>
        <input
          type="text"
          name="local-name"
          id="review-form__original-name"
          onChange={e => setOriginalName(e.target.value)}
          value={originalName}
        />
        <div>
          <label htmlFor="authors">{authorsName}</label>
          <input
            type="text"
            name="authors"
            id="review-form__authors"
            onChange={e => setAuthors(e.target.value)}
            value={authors}
          />
        </div>
        <label htmlFor="genre">Жанр(ы)</label>
        <input
          type="text"
          name="genre"
          id="review-form__genre"
          onChange={e => setGenre(e.target.value)}
          value={genre}
        />
      </fieldset>
      <fieldset>
        <div className="set__yr">
          <div>
            <label htmlFor="year">Год {yearName}</label>
            <input
              type="number"
              name="year"
              id="review-form__year"
              step="1"
              onChange={e => setYear(e.target.value)}
              value={year}
            />
          </div>
          <div className="set_r">
            <label htmlFor="rating">Моя оценка</label>
            <div className="star-rating__wrapper">
              {[...Array(10)].map((el, i) => {
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="rating"
                      value={i + 1}
                      onClick={() => setRating(i + 1)}
                    />
                    <FaStar
                      size="1.5em"
                      className="star"
                      color={i + 1 <= (hover || rating) ? '#FFC107' : 'gray'}
                      onMouseEnter={() => setHover(i + 1)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="form__viewed">
          <label htmlFor="viewed">Ознакомлен повторно </label>
          <input
            type="checkbox"
            id="viewed"
            name="viewed"
            onChange={e => setViewed(e.target.checked)}
            checked={viewed}
          />
        </div>
      </fieldset>
      <fieldset>
        <label htmlFor="review">Отзыв</label>
        <textarea
          name="review"
          id="review-form__review"
          cols="30"
          rows="7"
          required
          onChange={e => setText(e.target.value)}
          value={text}
        ></textarea>
      </fieldset>
      <button type="submit" className="review-form__submit">
        Отправить
      </button>
    </form>
  );
}
