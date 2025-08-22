import { Box, type SxProps, type Theme } from '@mui/material';
import { useCallback, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function HorizontalScrollList({ children, sx }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.button !== 0 || !scrollRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);

    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'text';
    }
  }, []);

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        if (scrollRef.current) {
          scrollRef.current.style.cursor = 'grab';
          scrollRef.current.style.userSelect = 'text';
        }
      }
    },
    [isDragging],
  );

  // 마우스가 움직일 때 (스크롤 로직)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isDragging || !scrollRef.current) return;

      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = x - startX;

      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        ...sx,
      }}
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </Box>
  );
}
