import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../api/userApi';

export const useUsers = (limit) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ key: '', order: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // состояние для фильтров
  const [genderFilter, setGenderFilter] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * limit;
      const data = await getUsers(limit, skip, sort.key, sort.order, searchTerm);
      
      let result = data.users || [];
      
      if (genderFilter) {
        result = result.filter(user => user.gender === genderFilter);
      }
      
      setUsers(result);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Ошибка соединения с сервером. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, searchTerm, limit, genderFilter]);

  useEffect(() => {
    const handler = setTimeout(loadData, 300);
    return () => clearTimeout(handler);
  }, [loadData]);

  return { 
    users, loading, error, total, 
    currentPage, setCurrentPage, 
    sort, setSort, 
    searchTerm, setSearchTerm,
    genderFilter, setGenderFilter,
    loadData
  };
};