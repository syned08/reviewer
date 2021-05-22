import React, { useState } from 'react';
import './foundReviews.css';

import ReviewCard from '../reviewCard';
import findResult from '../../assets/img/find-result.svg';
import Pagination from '../../components/pagination';

export default function FoundReviews({ foundReviews, category }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = foundReviews.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (e, pageNumber) => {
    e.preventDefault();

    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={foundReviews.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <div className="c-page__search__find-result">
        {currentPosts.length > 0 ? (
          currentPosts.map(el => (
            <ReviewCard
              key={`${el.id}-found`}
              el={el}
              category={category}
              style={{
                width: '45%',
                marginRight: 0,
                marginTop: 25,
                backgroundColor: '#F2F2F2',
              }}
            />
          ))
        ) : (
          <img
            src={findResult}
            alt="find-result"
            className="find-result__image"
          />
        )}
        {}
      </div>
    </div>
  );
}
