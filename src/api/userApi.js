const BASE_URL = 'https://dummyjson.com/users';

export const getUsers = async (limit, skip, sortBy = '', order = '', searchTerm = '') => {
  // Определяем базовый путь
  const endpoint = searchTerm ? `${BASE_URL}/search` : BASE_URL;
  
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('skip', skip);

  if (searchTerm) {
    params.append('q', searchTerm);
  }

  if (sortBy && order) {
    params.append('sortBy', sortBy);
    params.append('order', order);
  }

  const response = await fetch(`${endpoint}?${params.toString()}`);

if (!response.ok) {
  if (response.status === 404) throw new Error('Данные не найдены');
  if (response.status === 500) throw new Error('Ошибка сервера');
  throw new Error('Не удалось загрузить данные');
}

  return await response.json();
};