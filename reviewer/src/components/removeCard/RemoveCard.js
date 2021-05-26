import React, { useState } from 'react';
import './removeCard.css';
import { useAuth } from '../../contexts/AuthContext';

export default function RemoveCard({
  id,
  onClickClose,
  updateUserReviews,
  category,
}) {
  const { currentUser } = useAuth();
  const [removing, setRemoving] = useState(false);

  const handleDelete = async () => {
    setRemoving(true);
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbyCzcLstQfPHLHZLYCKLHl6odOXKRuJdxQ8SSaVVEzA_hDPYOTa6uIHmJ8ZkyBsY1A0RA/exec?category=${category}&delete=true&id=${id}&email=${currentUser.email}`,
      {
        method: 'POST',
      }
    );

    const data = await res.json();

    if (data.result.includes('OK')) {
      updateUserReviews();
      setRemoving(false);
      onClickClose();
    }
  };

  return (
    <div className="review-item__full__container">
      {removing && (
        <div className="sending">
          <h4 className="sending__heading">Удаление...</h4>
        </div>
      )}
      <div className="remove-card">
        <h4 className="remove-card__heading">Удалить отзыв?</h4>
        <div className="remove-card__controls">
          <span className="remove-card__controls__not" onClick={onClickClose}>
            Нет
          </span>
          <span
            className="remove-card__controls__yes"
            onClick={() => handleDelete()}
          >
            Да
          </span>
        </div>
      </div>
    </div>
  );
}
