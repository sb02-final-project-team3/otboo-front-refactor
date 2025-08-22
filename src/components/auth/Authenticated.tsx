import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';

export default function Authenticated() {
  const { authentication, isAuthenticated, fetchMe } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      (!authentication || !isAuthenticated) &&
      location.pathname !== ROUTE_OBJECTS.signIn.path &&
      location.pathname !== ROUTE_OBJECTS.signUp.path
    ) {
      console.log(
        'fetchMe',
        !authentication,
        !isAuthenticated,
        location.pathname !== ROUTE_OBJECTS.signIn.path,
        location.pathname !== ROUTE_OBJECTS.signUp.path,
        location.pathname,
      );
      fetchMe().catch(() => {
        navigate(ROUTE_OBJECTS.signIn.path);
      });
    }
  }, [isAuthenticated, authentication, navigate, fetchMe, location.pathname]);

  if (!isAuthenticated || !authentication) {
    return null;
  }

  return <Outlet />;
}
