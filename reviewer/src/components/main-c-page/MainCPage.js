import React from 'react';
import './mainCPage.css';

import CardList from '../../components/cardList';
import books from '../../assets/img/books.svg';
import games from '../../assets/img/games.svg';
import movies from '../../assets/img/movies.svg';

export default function MainCPage({ data, category }) {
  let categoryName,
    categoryAbout,
    imgName = '';

  switch (category) {
    case 'movies':
      [categoryName, categoryAbout, imgName] = ['Фильмы', 'о фильмах', movies];
      break;
    case 'books':
      [categoryName, categoryAbout, imgName] = ['Книги', 'о книгах', books];
      break;
    case 'games':
      [categoryName, categoryAbout, imgName] = ['Игры', 'об играх', games];
      break;
    default:
      break;
  }

  return (
    <section className="c-page__main">
      <div className="container">
        <h2 className="c-page__main__heading">{categoryName}</h2>
        <article className="c-page__main__last-reviews">
          <h3 className="c-page__main__last-reviews__heading">
            &#128293;{`Последние отзывы ${categoryAbout}:`}
          </h3>
          <CardList data={data} category={category} />
        </article>
      </div>
    </section>
  );
}
