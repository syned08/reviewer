import React, { useState, useEffect } from 'react';
import './movies.css';
import HeaderCPage from '../../components/header-c-page';
import Loader from '../../components/loader';
import MainCPage from '../../components/main-c-page';
import SearchCPage from '../../components/search-c-page';

export default function Movies() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    const data = await fetch(
      'https://script.google.com/macros/s/AKfycbz1nBbhcKJ-LYUEUg5dpY5fcTz0ZMkRlLP57E3m8jqWVNpo9fp-pzqbnZgM_ZLPLhvfqw/exec?category=film&reviews=all'
    );
    const allReviews = await data.json();

    setReviews(allReviews.allReviews);
    setLoading(false);
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
    </div>
  );
}
