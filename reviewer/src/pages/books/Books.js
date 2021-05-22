import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
// import LastReviews from '../../components/lastReviews';
import Loader from '../../components/loader';
import './books.css';

export default function Books() {
  const { logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const data = await fetch(
      'https://script.google.com/macros/s/AKfycbz1nBbhcKJ-LYUEUg5dpY5fcTz0ZMkRlLP57E3m8jqWVNpo9fp-pzqbnZgM_ZLPLhvfqw/exec?category=book&reviews=all'
    );
    const allReviews = await data.json();
    setReviews(allReviews.allReviews);
    setLoading(false);
  };

  const handleLogout = async e => {
    e.preventDefault();

    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="c-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="c-page">
      <Header>
        <a href="#search">Поиск</a>
        <a href="#create-review">Оставить отзыв</a>
        <Link to="/home/books/my-reviews">Мои отзывы</Link>
        <a href="/" onClick={handleLogout}>
          Выйти
        </a>
      </Header>
      <div className="container c-page__header">
        <h1 className="c-page__heading">Книги</h1>
        {/* <LastReviews data={reviews.slice(-10)} name="о книгах" /> */}
      </div>
    </div>
  );
}
