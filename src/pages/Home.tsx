import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../router';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTE_OBJECTS.recommendation.path);
  }, [navigate]);

  return null;
}
