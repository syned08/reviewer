import React from 'react';
import './register.css';

import Header from '../../components/header';
import Form from './components/form';
import AssetBlock from '../../components/assetBlock';
import bloggingTwo from '../../assets/img/bloggingTwo.svg';

export default function Register() {
  return (
    <div className="register">
      <Header />
      <Form />
      <div className="image-asset">
        <img src={bloggingTwo} alt="blogging" className="blogging-img" />
      </div>
      <AssetBlock
        style={{
          bottom: 170,
          left: -10,
          width: '60%',
          height: 40,
          background: '#FCE8E4',
          zIndex: 1,
        }}
      />
      <AssetBlock
        style={{
          bottom: 110,
          left: -10,
          width: '40%',
          height: 55,
          background: '#D6C5FD',
        }}
      />
    </div>
  );
}
