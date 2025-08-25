import CheckroomIcon from '@mui/icons-material/Checkroom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import RecommendationIcon from '@mui/icons-material/Recommend';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatshotIcon from '@mui/icons-material/Whatshot';

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import usePageInfo from '../../hooks/usePageInfo';
import { ROUTE_OBJECTS } from '../../router';
import useAuthStore from '../../stores/authStore';

interface Props {
  drawerWidth: number;
}

const appName = '옷장을 부탁해';

export default function Sidebar({ drawerWidth }: Props) {
  const { authentication } = useAuthStore();
  const navigate = useNavigate();
  const { activeRouterObjectKey } = usePageInfo();

  const handleClickMenu = useCallback(
    (routeKey: keyof typeof ROUTE_OBJECTS) => {
      navigate(ROUTE_OBJECTS[routeKey].path);
    },
    [navigate],
  );

  const menuIcons: Record<keyof typeof ROUTE_OBJECTS, React.ReactNode> = {
    home: <HomeIcon />,
    recommendation: <RecommendationIcon />,
    hotFeed: <WhatshotIcon />, // 2. 아이콘 매핑 추가
    closet: <CheckroomIcon />,
    feed: <PublicIcon />,
    userManagement: <PersonIcon />,
    attributeDefManagement: <SettingsIcon />,
  };

  const isActiveMenu = useCallback(
    (routeKey: keyof typeof ROUTE_OBJECTS) => {
      return activeRouterObjectKey === routeKey;
    },
    [activeRouterObjectKey],
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 0,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" color="inherit">
          {appName}
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'primary.light' }} />
      <List>
        {['recommendation', 'closet', 'feed', 'hotFeed'].map((routeKey) => (
          <ListItem
            key={ROUTE_OBJECTS[routeKey].title}
            disablePadding
            sx={{
              backgroundColor: isActiveMenu(routeKey) ? 'primary.light' : 'transparent',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: isActiveMenu(routeKey) ? '4px' : '0px',
                backgroundColor: 'primary.light',
                transition: 'width 0.2s ease-in-out',
              },
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.dark',
                '&::before': {
                  width: '4px',
                },
              },
            }}
          >
            <ListItemButton onClick={() => handleClickMenu(routeKey)}>
              <ListItemIcon sx={{ color: 'inherit' }}>{menuIcons[routeKey]}</ListItemIcon>
              <ListItemText primary={ROUTE_OBJECTS[routeKey].title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {authentication?.role === 'ADMIN' && (
        <>
          <Divider sx={{ borderColor: 'primary.light' }} />
          <List>
            {['userManagement', 'attributeDefManagement'].map((routeKey) => (
              <ListItem
                key={ROUTE_OBJECTS[routeKey].title}
                disablePadding
                sx={{
                  backgroundColor: isActiveMenu(routeKey) ? 'primary.light' : 'transparent',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: isActiveMenu(routeKey) ? '4px' : '0px',
                    backgroundColor: 'primary.light',
                    transition: 'width 0.2s ease-in-out',
                  },
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    '&::before': {
                      width: '4px',
                    },
                  },
                }}
              >
                <ListItemButton onClick={() => handleClickMenu(routeKey)}>
                  <ListItemIcon sx={{ color: 'inherit' }}>{menuIcons[routeKey]}</ListItemIcon>
                  <ListItemText primary={ROUTE_OBJECTS[routeKey].title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}
