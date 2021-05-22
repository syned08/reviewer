import React, { useState } from 'react';

import './searchCPage.css';
import search from '../../assets/img/search.svg';
import FoundReviews from '../../components/foundReviews';
import AssetBlock from '../../components/assetBlock';

export default function SearchCPage({ data, category }) {
  const [query, setQuery] = useState('');
  const [foundReviews, setFoundReviews] = useState([]);

  let pageName = '';

  switch (category) {
    case 'movies':
      pageName = 'фильма';
      break;
    case 'books':
      pageName = 'книги';
      break;
    case 'games':
      pageName = 'игры';
      break;
    default:
      break;
  }

  const handleSearch = async e => {
    e.preventDefault();

    if (query === '') {
      setFoundReviews([]);
    } else {
      const result = data.filter(el =>
        el.title.toLowerCase().includes(query.toLowerCase())
      );

      setFoundReviews(result);
    }
  };

  return (
    <div className="c-page__search">
      <div className="container">
        <h2 className="c-page__search__heading">{`Поиск по названию ${pageName}:`}</h2>
        <div className="c-page__search-find__wrapper">
          <input
            type="text"
            name="search-value"
            id="search"
            onChange={e => setQuery(e.target.value)}
            className="search-input"
            spellCheck="false"
          />
          <a href="/" onClick={handleSearch} className="search-button-a">
            <img src={search} alt="seach" className="search-button" />
          </a>
        </div>
        <FoundReviews
          foundReviews={[...foundReviews].reverse()}
          category={category}
        />
      </div>
      <AssetBlock
        style={{
          bottom: 155,
          left: -10,
          width: '30%',
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
