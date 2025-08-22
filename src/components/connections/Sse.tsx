import { useEffect } from 'react';
import { useSseStore } from '../../stores/sseStore';
import useAuthStore from '../../stores/authStore';

interface SseConnectedProps {
  children: React.ReactNode;
}

export default function Sse({ children }: SseConnectedProps) {
  const { connect, disconnect } = useSseStore();
  const { authentication } = useAuthStore();

  useEffect(() => {
    if (authentication?.accessToken) {
      connect(authentication.accessToken);
    }
    return () => {
      disconnect();
    };
  }, [authentication?.accessToken, connect, disconnect]);

  return <>{children}</>;
}
