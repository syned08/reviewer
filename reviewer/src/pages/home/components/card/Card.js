import React from 'react';
import './card.css';
import movies from '../../../../assets/img/movies.svg';
import books from '../../../../assets/img/books.svg';
import games from '../../../../assets/img/games.svg';
import { Link } from 'react-router-dom';

export default function Card({ category }) {
  let icon = movies,
    categoryName = 'Фильмы';

  switch (category) {
    case 'books':
      icon = books;
      categoryName = 'Книги';
      break;
    case 'games':
      icon = games;
      categoryName = 'Игры';
      break;
    default:
      break;
  }

  return (
    <Link to={`/home/${category}`} className="home-card">
      <div className="home-card__img-wrapper">
        <img src={icon} alt={category} className="home-card__img" />
      </div>
      <h3 className="home-card__title">{categoryName}</h3>
    </Link>
  );
}
