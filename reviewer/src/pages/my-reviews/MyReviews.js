import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/ru';

import './myReviews.css';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/loader';
import CardList from '../../components/cardList';

export default function MyReviews({ match }) {
  const { logout, currentUser } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = match.params.category;
  let categoryName = '';

  switch (category) {
    case 'movies':
      categoryName = 'film';
      break;
    case 'books':
      categoryName = 'book';
      break;
    case 'games':
      categoryName = 'game';
      break;
    default:
      break;
  }

  useEffect(() => {
    const getUserReviews = async () => {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbyCzcLstQfPHLHZLYCKLHl6odOXKRuJdxQ8SSaVVEzA_hDPYOTa6uIHmJ8ZkyBsY1A0RA/exec?category=${categoryName}&email=${currentUser.email}`
      );
      const data = await res.json();

      setUserReviews(data.allReviewsUser.reverse());
      setLoading(false);
    };

    getUserReviews();
  }, [categoryName, currentUser.email]);

  const handleGoBack = e => {
    e.preventDefault();

    window.history.back();
  };

  const handleLogout = async e => {
    e.preventDefault();

    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  const getReviewsPeriod = () => {
    const uniqueDays = userReviews
      .map(el => {
        if (
          moment(el.creationDate).format('DD MMMM YYYY') ===
          moment().format('DD MMMM YYYY')
        ) {
          return 'Сегодня';
        } else {
          return moment(el.creationDate).format('DD MMMM YYYY');
        }
      })
      .filter((value, index, self) => self.indexOf(value) === index);

    return uniqueDays;
  };

  const convertDateToStr = ms => {
    if (moment(ms).format('DD MMMM YYYY') === moment().format('DD MMMM YYYY')) {
      return 'Сегодня';
    } else {
      return moment(ms).format('DD MMMM YYYY');
    }
  };

  const updateUserReviews = async () => {
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbyCzcLstQfPHLHZLYCKLHl6odOXKRuJdxQ8SSaVVEzA_hDPYOTa6uIHmJ8ZkyBsY1A0RA/exec?category=${categoryName}&email=${currentUser.email}`
    );
    const data = await res.json();

    setUserReviews(data.allReviewsUser.reverse());
  };

  if (loading) {
    return (
      <div className="mr-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mr-page">
      <Header>
        <a href="/" onClick={e => handleGoBack(e)}>
          Назад
        </a>
        <a href="/" onClick={e => handleLogout(e)}>
          Выйти
        </a>
      </Header>
      <div className="container">
        <h1 className="mr-page__heading">Мои отзывы</h1>
        {getReviewsPeriod().length === 0 && (
          <h4 className="mr-page__heading__no_reviews">
            У вас пока нет отзывов
          </h4>
        )}
        {getReviewsPeriod().map(el => {
          const data = userReviews.filter(
            review => convertDateToStr(review.creationDate) === el
          );

          return (
            <article key={el}>
              <h3 className="mr-page__sub-heading">{el}</h3>
              <CardList
                data={data}
                category={match.params.category}
                myReviews={true}
                updateUserReviews={updateUserReviews}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
