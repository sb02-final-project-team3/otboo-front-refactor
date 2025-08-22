import { useNavigate } from 'react-router';
import useAuthStore from '../stores/authStore';
import { useEffect } from 'react';
import { ROUTE_OBJECTS } from '../router';

export default function SignOutPage() {
  const { signOut, fetchCsrfToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    signOut().then(() => {
      fetchCsrfToken();
      navigate(ROUTE_OBJECTS.signIn.path);
    });
  }, [signOut, navigate, fetchCsrfToken]);

  return null;
}
