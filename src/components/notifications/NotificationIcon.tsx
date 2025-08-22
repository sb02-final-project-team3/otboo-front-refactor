import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import NotificationSidebar from './NotificationSidebar';
import useNotificationStore from '../../stores/notificationStore';
import useAuthStore from '../../stores/authStore';
import { useSseStore } from '../../stores/sseStore';
import type { NotificationDto } from '../../types/notifications';

export default function NotificationIcon() {
  const { isAuthenticated } = useAuthStore();
  const { notifications, fetchNotifications, addNotification } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const { isConnected, subscribe } = useSseStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [fetchNotifications, isAuthenticated]);

  useEffect(() => {
    if (isConnected) {
      subscribe('notifications', (notification: NotificationDto) => {
        addNotification(notification);
      });
    }
  }, [isConnected, subscribe, addNotification]);

  return (
    <Badge
      badgeContent={notifications.length}
      color="error"
      sx={{
        position: 'relative',
        top: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
        size="small"
      >
        <NotificationsIcon />
      </IconButton>
      <NotificationSidebar notifications={notifications} open={open} onClose={() => setOpen(false)} />
    </Badge>
  );
}
