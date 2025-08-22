import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { ROUTE_OBJECTS } from '../router';

export default function usePageInfo() {
  const location = useLocation();

  const activeRouterObjectKey = useMemo((): keyof typeof ROUTE_OBJECTS | undefined => {
    const pathname = location.pathname;

    return Object.keys(ROUTE_OBJECTS).find((key) => pathname === ROUTE_OBJECTS[key].path);
  }, [location.pathname]);

  return {
    activeRouterObjectKey,
  };
}
