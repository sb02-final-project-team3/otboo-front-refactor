import { Outlet } from 'react-router';
import Forbidden from './Forbidden';
import type { UserRole } from '../../types/common';
import useAuthStore from '../../stores/authStore';

interface Props {
  roles: UserRole[];
}

export default function Authorized({ roles }: Props) {
  const { authentication } = useAuthStore();

  if (!authentication?.role || !roles.includes(authentication.role)) {
    console.log('Access denied');
    return <Forbidden />;
  }

  return <Outlet />;
}
