import './form.css';
import React, { useRef, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function From() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const history = useHistory();

  const handleSubmit = async e => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Пароли не совпадают!');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push('/home');
    } catch (error) {
      setError('Не удалось создать аккаунт!');
    }

    setLoading(false);
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-header">Регистрация</h3>
      {error && <h4 className="form-error">{error}</h4>}
      <form action="/" className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">Почта</label>
        <input type="email" name="email" id="email" ref={emailRef} />
        <label htmlFor="password" className="label_password">
          Пароль
        </label>
        <input
          type="password"
          name="password"
          id="password"
          ref={passwordRef}
        />
        <label htmlFor="password" className="label_password">
          Подтвердите пароль
        </label>
        <input
          type="password"
          name="password-submit"
          id="password-submit"
          ref={passwordConfirmRef}
        />
        <div className="btn-wrapper">
          <input
            type="submit"
            value="Зарегистрироваться"
            id="form__submit"
            disabled={loading}
          />
        </div>
      </form>
      <div className="register_wrapper">
        <Link to="/login" className="register_btn">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
