import React from 'react';
import { useLocation } from 'react-router-dom';

import './editReview.css';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from '../../components/reviewForm';

export default function EditReview({ match }) {
  const { logout } = useAuth();
  const location = useLocation();
  const category = match.params.category;

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
      <ReviewForm el={location.el} category={category} />
    </div>
  );
}
