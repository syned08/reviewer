import './form.css';
import { useRef, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function From() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signinGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const history = useHistory();

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push('/home');
    } catch (error) {
      setError('Не удалось войти!');
    }

    setLoading(false);
  };

  const handleGoogleAuth = async e => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signinGoogle();
      history.push('/home');
    } catch (error) {
      console.log(error);
      setError('Не удалось войти!');
    }

    setLoading(false);
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-header">Вход</h3>
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
        <div className="btn-wrapper">
          <input
            type="submit"
            value="Войти"
            id="form__submit"
            disabled={loading}
          />
          <a href="/" className="google_wrapper" onClick={handleGoogleAuth}>
            <img src="google.svg" alt="google" className="google" />
          </a>
        </div>
      </form>
      <div className="register_wrapper">
        <span>Нет аккаунта? </span>
        <Link to="/register" className="register_btn">
          Регистрация
        </Link>
      </div>
    </div>
  );
}
