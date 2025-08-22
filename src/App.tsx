import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router';
import router from './router';
import theme from './theme';
import Alert from './components/Alert/Alert';
import useAuthStore from './stores/authStore';
import { useEffect } from 'react';

function App() {
  const { fetchCsrfToken } = useAuthStore();

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <Alert />
    </ThemeProvider>
  );
}

export default App;
