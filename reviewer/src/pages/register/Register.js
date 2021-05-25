import React from 'react';
import './register.css';

import Header from '../../components/header';
import Form from './components/form';
import bloggingTwo from '../../assets/img/bloggingTwo.svg';

export default function Register() {
  return (
    <div className="register">
      <Header />
      <Form />
      <div className="image-asset">
        <img src={bloggingTwo} alt="blogging" className="blogging-img" />
      </div>
    </div>
  );
}
