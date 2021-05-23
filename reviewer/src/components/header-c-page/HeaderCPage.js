import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Link } from 'react-router-dom';
import Header from '../header';
import { useAuth } from '../../contexts/AuthContext';

export default function HeaderCPage({ category }) {
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
    <Header>
      <AnchorLink href="#c-page__search">Поиск</AnchorLink>
      <AnchorLink href="#c-page__review">Оставить отзыв</AnchorLink>
      <Link to={`/home/${category}/my-reviews`}>Мои отзывы</Link>
      <a href="/" onClick={handleLogout}>
        Выйти
      </a>
    </Header>
  );
}
