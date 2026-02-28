import { useState, useRef } from 'react';

export const useColumnResize = (initialWidths) => {
  const [widths, setWidths] = useState(initialWidths);
  const resizer = useRef({ col: null, startX: 0, startWidth: 0 });

  // Начало изменения размера колонки
  const startResize = (e, col) => {
    resizer.current = { col, startX: e.clientX, startWidth: widths[col] };
    document.addEventListener('mousemove', doResize);  //движение мышки
    document.addEventListener('mouseup', stopResize);  //отпускане мышки
  };

    // Процесс
  const doResize = (e) => {
    const { col, startX, startWidth } = resizer.current;
    if (col) {
      const newWidth = Math.max(50, startWidth + (e.clientX - startX)); 
      setWidths(prev => ({ ...prev, [col]: newWidth }));
    }
  };

  // Конец
  const stopResize = () => {
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  return { widths, startResize };
};