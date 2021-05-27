import React from 'react';
import Header from '../../components/header';
import { Link } from 'react-router-dom';

import './start.css';
import idea from '../../assets/img/idea.svg';
import category from '../../assets/img/category.svg';
import review from '../../assets/img/review.svg';
import publish from '../../assets/img/publish.svg';

export default function Start() {
  return (
    <div className="start">
      <Header>
        <Link to="/login" className="go-to-login">
          Войти
        </Link>
        <Link to="/register" className="go-to-register">
          Регистрация
        </Link>
      </Header>
      <section className="start-header">
        <div className="container start-header__container">
          <div className="start-header__left">
            <h1 className="start-header__left__heading">
              Поделись своим мнением.
            </h1>
            <Link to="/login" className="go-to-login-btn">
              Начать
            </Link>
          </div>
          <div className="start-header__right">
            <img src={idea} alt="idea" className="idea" />
          </div>
        </div>
      </section>
      <section className="how-works container">
        <h2 className="how-works__heading">Как это работает</h2>
        <div className="how-works__items">
          <div className="how-works__item">
            <img src={category} alt="category" />
            <p>Выбери категорию и предмет</p>
          </div>
          <div className="how-works__item">
            <img src={review} alt="category" />
            <p>Напиши отзыв</p>
          </div>
          <div className="how-works__item">
            <img src={publish} alt="category" />
            <p>Опубликуй</p>
          </div>
        </div>
      </section>
      <section className="telegram-section ">
        <div className="container">
          <h2 className="telegram-section__heading">Телеграм бот</h2>
          <div className="telegram-section__items">
            <p>Пользуйся сервисом через популярный месенджер!</p>
            <a
              href="http://t.me/reviewer_practice_bot"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="telegram.ico"
                alt="telegram"
                className="telegram-home"
              />
            </a>
          </div>
        </div>
      </section>
      <footer className="footer-start">
        <div className="container footer-container">
          <div>
            <p>Все права защищены</p>
            <p>2021</p>
          </div>
          <div>
            <p>Рецензент</p>
            <p>ХНУРЭ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
