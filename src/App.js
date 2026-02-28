import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import { useColumnResize } from './hooks/useColumnResize';
import UserModal from './components/UserModal';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

const INITIAL_WIDTHS = {
  lastName: 140, firstName: 120, maidenName: 140, age: 80, 
  gender: 70, phone: 160, email: 200, country: 120, city: 120
};

const COLUMNS = [
  { key: 'lastName', label: 'Фамилия', sortable: true },
  { key: 'firstName', label: 'Имя', sortable: true },
  { key: 'maidenName', label: 'Отчество', sortable: true },
  { key: 'age', label: 'Возраст', sortable: true },
  { key: 'gender', label: 'Пол', sortable: true },
  { key: 'phone', label: 'Телефон', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'country', label: 'Страна', sortable: false },
  { key: 'city', label: 'Город', sortable: false }
];

function App() {
  const limit = 15;
  const { 
    users, loading, error, total, 
    currentPage, setCurrentPage, 
    sort, setSort, 
    searchTerm, setSearchTerm,
    genderFilter, setGenderFilter,
    loadData 
  } = useUsers(limit);

  const { widths, startResize } = useColumnResize(INITIAL_WIDTHS);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSort = (key) => {
    setSort(prev => {
      if (prev.key !== key) return { key, order: 'asc' };
      if (prev.order === 'asc') return { key, order: 'desc' };
      return { key: '', order: '' };
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="app-container">
      <h1>Таблица персонала</h1>
      
      <div className="toolbar">
        <div className="search-wrapper">
          <input 
            className="search-input"
            placeholder="Поиск по ФИО, телефону..." 
            value={searchTerm}
            onChange={(e) => { 
              setSearchTerm(e.target.value); 
              setCurrentPage(1); 
            }}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Фильтр:</span>
          <select 
            className="filter-select"
            value={genderFilter} 
            onChange={(e) => { 
              setGenderFilter(e.target.value); 
              setCurrentPage(1); 
            }}
          >
            <option value="">Все полы</option>
            <option value="male">Мужчины</option>
            <option value="female">Женщины</option>
          </select>
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : (
        <>
          <div className="table-wrapper">
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
              <thead>
                <tr>
                  {COLUMNS.map(col => (
                    <th key={col.key} style={{ width: widths[col.key], minWidth: '50px' }}>
                      <div className="header-cell">
                        <span 
                          onClick={() => col.sortable && handleSort(col.key)} 
                          className={col.sortable ? 'sort-trigger' : ''}
                        >
                          {col.label} {sort.key === col.key ? (sort.order === 'asc' ? '↑' : '↓') : ''}
                        </span>
                        <div className="resizer" onMouseDown={(e) => startResize(e, col.key)} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="loading-cell">Загрузка данных...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="9" className="empty-cell">Пользователи не найдены</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} onClick={() => setSelectedUser(user)} className="table-row">
                      <td>{user.lastName}</td>
                      <td>{user.firstName}</td>
                      <td>{user.maidenName}</td>
                      <td>{user.age}</td>
                      <td>{user.gender === 'male' ? 'М' : 'Ж'}</td>
                      <td>{user.phone}</td>
                      <td className="truncate">{user.email}</td>
                      <td>{user.address.country}</td>
                      <td>{user.address.city}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && users.length > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Показано <b>{users.length}</b> из <b>{total}</b> записей
              </div>
              
              <div className="pagination-controls">
                <button 
                  className="pager-btn"
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(1)}
                  title="В начало"
                >«
                </button>
                
                <button 
                  className="pager-btn"
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                >Назад
                </button>

                <div className="page-display">
                  <span className="current-page-badge">{currentPage}</span>
                  <span className="total-pages-label">из {totalPages}</span>
                </div>

                <button 
                  className="pager-btn"
                  disabled={currentPage >= totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                > Вперед
                </button>
                
                <button 
                  className="pager-btn"
                  disabled={currentPage >= totalPages} 
                  onClick={() => setCurrentPage(totalPages)}
                  title="В конец"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default App;