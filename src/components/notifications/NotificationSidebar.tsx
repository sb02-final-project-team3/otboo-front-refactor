import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import useNotificationStore from '../../stores/notificationStore';
import type { NotificationDto, NotificationLevel } from '../../types/notifications';
import dayjs from 'dayjs';

interface Props {
  notifications: NotificationDto[];
  open?: boolean;
  onClose?: () => void;
}

export default function NotificationSidebar({ notifications, open, onClose }: Props) {
  const { readNotification } = useNotificationStore();

  const notificationIcons: Record<NotificationLevel, React.ReactNode> = {
    INFO: <InfoIcon color="primary" />,
    WARNING: <WarningIcon color="warning" />,
    ERROR: <ErrorIcon color="error" />,
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '300px',
          marginTop: '64px', // AppBar 높이만큼 여백 추가
          height: 'calc(100% - 64px)', // AppBar 높이만큼 빼기
        },
      }}
    >
      {notifications.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="body1" component="span" display="block" sx={{ textAlign: 'center' }}>
            알림이 없습니다.
          </Typography>
        </Box>
      )}
      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                transition: 'width 0.2s ease-in-out',
              },
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.light',
                '&::before': {
                  width: '4px',
                },
                cursor: 'pointer',
              },
            }}
            onClick={() => readNotification(notification.id)}
          >
            <ListItemIcon sx={{ justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {notificationIcons[notification.level]}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={notification.title}
              secondary={
                <>
                  <Tooltip
                    title={notification.content}
                    placement="left"
                    sx={{
                      maxWidth: '500px',
                      '& .MuiTooltip-tooltip': {
                        maxWidth: '500px',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="span"
                      display="block"
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                      }}
                    >
                      {notification.content}
                    </Typography>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(notification.createdAt).format('M월 D일 HH:mm:ss')}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
