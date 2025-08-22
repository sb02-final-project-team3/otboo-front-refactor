import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTE_OBJECTS } from '../../router';
import { useNavigate } from 'react-router';
import NotificationIcon from '../notifications/NotificationIcon';
import usePageInfo from '../../hooks/usePageInfo';
import useAuthStore from '../../stores/authStore';
import useMyProfileStore from '../../stores/myProfileStore';

interface Props {
  drawerWidth: number;
}

export default function Header({ drawerWidth }: Props) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { activeRouterObjectKey } = usePageInfo();
  const navigate = useNavigate();
  const { signOut, authentication } = useAuthStore();
  const { myProfile, fetchMyProfile } = useMyProfileStore();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = useCallback(
    (callback?: () => void) => {
      setAnchorElUser(null);
      if (callback) {
        callback();
      }
    },
    [setAnchorElUser],
  );

  const userMenu = useMemo(() => {
    return [
      {
        label: ROUTE_OBJECTS.profileManagement.title,
        onClick: () => {
          navigate(ROUTE_OBJECTS.profileManagement.path);
        },
      },
      {
        label: '로그아웃',
        onClick: () => {
          // signOut();
          navigate(ROUTE_OBJECTS.signOut.path);
        },
      },
    ];
  }, [navigate, signOut]);

  useEffect(() => {
    if (authentication) {
      fetchMyProfile();
    }
  }, [authentication, fetchMyProfile]);

  return (
    <AppBar
      color="default"
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        borderRadius: 0,
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
      }}
      elevation={0}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {activeRouterObjectKey && ROUTE_OBJECTS[activeRouterObjectKey as keyof typeof ROUTE_OBJECTS]?.title}
          </Typography>
        </Box>
        <Box mr={2}>
          <NotificationIcon />
        </Box>
        <Box>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={myProfile?.profileImageUrl} key={myProfile?.profileImageUrl} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={() => handleCloseUserMenu()}
          >
            {userMenu.map((menu) => (
              <MenuItem key={menu.label} onClick={() => handleCloseUserMenu(menu.onClick)}>
                <Typography sx={{ textAlign: 'center' }}>{menu.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
