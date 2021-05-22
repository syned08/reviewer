import React from 'react';
import './home.css';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import Card from './components/card';

export default function Start() {
  const { logout } = useAuth();

  const handleLogout = async e => {
    e.preventDefault();

    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-home">
      <Header>
        <a href="/" onClick={handleLogout}>
          Выйти
        </a>
      </Header>
      <div className="home__cards-wrapper container">
        <Card category="movies" />
        <Card category="books" />
        <Card category="games" />
      </div>
    </div>
  );
}
