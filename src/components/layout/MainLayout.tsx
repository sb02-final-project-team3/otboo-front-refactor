import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router';
import Sse from '../connections/Sse';
import WebSocket from '../connections/WebSocket';

const drawerWidth = 200;

export default function MainLayout() {
  return (
    <div>
      <Header drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Toolbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          width: `calc(100vw - ${drawerWidth}px)`,
          p: '1rem',
          height: 'calc(100vh - 64px)',
        }}
      >
        <Sse>
          <WebSocket>
            <Outlet />
          </WebSocket>
        </Sse>
      </Box>
    </div>
  );
}
