import { useEffect, useRef } from 'react';

export default function useInfiniteScroll(fetchMore: () => Promise<void>, reverse?: boolean) {
  const infiniteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (infiniteScrollRef.current) {
      infiniteScrollRef.current.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = infiniteScrollRef.current as HTMLDivElement;
        if (reverse) {
          if (scrollTop < 5) {
            fetchMore();
          }
        } else {
          if (scrollHeight - (scrollTop + clientHeight) < 5) {
            fetchMore();
          }
        }
      });
    }
  }, [fetchMore]);

  useEffect(() => {
    if (infiniteScrollRef.current) {
      infiniteScrollRef.current.scrollTo({
        top: reverse ? infiniteScrollRef.current.scrollHeight : 0,
        behavior: 'instant',
      });
    }
  }, []);
  return { infiniteScrollRef };
}
