import React, { useState, useEffect } from 'react';
import './movies.css';
import Loader from '../../components/loader';
import HeaderCPage from '../../components/header-c-page';
import MainCPage from '../../components/main-c-page';
import SearchCPage from '../../components/search-c-page';
import ReviewCPage from '../../components/review-c-page';

export default function Movies() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const data = await fetch(
      'https://script.google.com/macros/s/AKfycbz6bZt6VRP91g6QPqbo-DOHDhE37SscU66sMcoPlZOdHdmnlYnN3zCyh_XVbfNcfIgcYA/exec?category=film&reviews=all'
    );
    const allReviews = await data.json();

    setReviews(allReviews.allReviews);
    setLoading(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    const list = document.querySelector('.reviews-wrapper');
    list.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
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
      <HeaderCPage category="movies" />
      <MainCPage data={[...reviews].reverse().slice(0, 10)} category="movies" />
      <SearchCPage data={reviews} category="movies" />
      <ReviewCPage category="movies" getReviews={getReviews} />
    </div>
  );
}
