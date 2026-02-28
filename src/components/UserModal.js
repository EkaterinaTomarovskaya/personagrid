import React from 'react';

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <img src={user.image} alt="аватар" width="120" style={{ borderRadius: '50%' }} />
        <h2>{`${user.lastName} ${user.firstName} ${user.maidenName || ''}`}</h2>
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <p><strong>Возраст:</strong> {user.age}</p>
          <p><strong>Адрес:</strong> {`${user.address.country}, ${user.address.city}, ${user.address.address}`}</p>
          <p><strong>Рост:</strong> {user.height} см</p>
          <p><strong>Вес:</strong> {user.weight} кг</p>
          <p><strong>Телефон:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserModal;