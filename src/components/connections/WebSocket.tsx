import { useEffect } from 'react';
import { useWebSocketStore } from '../../stores/websocketStore';
import useAuthStore from '../../stores/authStore';

interface WebSocketProps {
  children: React.ReactNode;
}

export default function WebSocket({ children }: WebSocketProps) {
  const { connect, disconnect } = useWebSocketStore();
  const { authentication } = useAuthStore();

  useEffect(() => {
    if (authentication?.accessToken) {
      connect(authentication.accessToken);
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect, authentication]);

  return <>{children}</>;
}
