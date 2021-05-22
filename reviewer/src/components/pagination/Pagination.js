import React from 'react';
import './pagination.css';

export default function Pagination({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <li
          key={number}
          className={
            currentPage === number ? 'page-item page-item__active' : 'page-item'
          }
          onClick={e => paginate(e, number)}
        >
          <a href="/" className="page-link" onClick={e => e.preventDefault()}>
            {number}
          </a>
        </li>
      ))}
    </div>
  );
}
