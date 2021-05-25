import React from 'react';
import './mainCPage.css';

import CardList from '../../components/cardList';

export default function MainCPage({ data, category }) {
  let categoryName, categoryAbout;

  switch (category) {
    case 'movies':
      [categoryName, categoryAbout] = ['Фильмы', 'о фильмах'];
      break;
    case 'books':
      [categoryName, categoryAbout] = ['Книги', 'о книгах'];
      break;
    case 'games':
      [categoryName, categoryAbout] = ['Игры', 'об играх'];
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
