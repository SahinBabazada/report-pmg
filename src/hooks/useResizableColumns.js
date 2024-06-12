import { useRef, useEffect } from 'react';

const useResizableColumns = (columns) => {
  const headersRef = useRef([]);

  useEffect(() => {
    const handleResize = (e, index) => {
      const header = headersRef.current[index];
      const startX = e.pageX;
      const startWidth = header.offsetWidth;

      const onMouseMove = (e) => {
        const newWidth = startWidth + (e.pageX - startX);
        header.style.width = `${newWidth}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    headersRef.current.forEach((header, index) => {
      const resizer = document.createElement('div');
      resizer.className = 'resizer';
      resizer.addEventListener('mousedown', (e) => handleResize(e, index));
      header.appendChild(resizer);
    });
  }, [columns]);

  return headersRef;
};

export default useResizableColumns;
