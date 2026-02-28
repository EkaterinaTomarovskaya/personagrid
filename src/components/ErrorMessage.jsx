import React from 'react';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <div style={{ fontSize: '40px', marginBottom: '10px' }}></div>
    <h3>Упс! Что-то пошло не так</h3>
    <p>{message}</p>
    <button className="retry-btn" onClick={onRetry}>
      Повторить попытку
    </button>
  </div>
);

export default ErrorMessage;