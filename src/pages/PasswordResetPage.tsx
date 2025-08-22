import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../router';
import useAlertStore from '../stores/alertStore';
import useAuthStore from '../stores/authStore';
import ChangePassword from '../components/auth/ChangePassword';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const PasswordResetContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function PasswordResetPage() {
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Will be initialized from localStorage
  const { openErrorAlert, openAlert } = useAlertStore();
  const { signIn, error, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';

  // Initialize timer from localStorage
  useEffect(() => {
    if (!email) return;
    
    const timerKey = `password_reset_timer_${email}`;
    const storedEndTime = localStorage.getItem(timerKey);
    
    if (storedEndTime) {
      // Calculate remaining time
      const endTime = parseInt(storedEndTime);
      const currentTime = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((endTime - currentTime) / 1000));
      
      if (remainingSeconds > 0) {
        setTimeLeft(remainingSeconds);
      } else {
        // Timer already expired
        localStorage.removeItem(timerKey);
        openAlert({
          title: '시간 만료',
          message: '임시 비밀번호가 만료되었습니다. 다시 시도해주세요.',
          type: 'error',
        });
        navigate(ROUTE_OBJECTS.signIn.path);
      }
    } else {
      // No timer found - shouldn't happen if properly navigated from ForgotPassword
      openAlert({
        title: '잘못된 접근',
        message: '비밀번호 재설정을 다시 요청해주세요.',
        type: 'error',
      });
      navigate(ROUTE_OBJECTS.signIn.path);
    }
  }, [email, openAlert, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordError || !temporaryPassword) {
      return;
    }
    
    if (!email) {
      setPasswordError(true);
      setPasswordErrorMessage('이메일 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    await signIn(email, temporaryPassword);
  };

  useEffect(() => {
    if (error) {
      openErrorAlert(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      setShowChangePassword(true);
      // Clear timer when successfully authenticated
      const timerKey = `password_reset_timer_${email}`;
      localStorage.removeItem(timerKey);
    }
  }, [isAuthenticated, email]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || showChangePassword) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Clear timer from localStorage
          const timerKey = `password_reset_timer_${email}`;
          localStorage.removeItem(timerKey);
          
          openAlert({
            title: '시간 만료',
            message: '임시 비밀번호가 만료되었습니다. 다시 시도해주세요.',
            type: 'error',
          });
          navigate(ROUTE_OBJECTS.signIn.path);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showChangePassword, openAlert, navigate, email]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateInputs = () => {
    let isValid = true;

    if (!temporaryPassword || temporaryPassword.length < 1) {
      setPasswordError(true);
      setPasswordErrorMessage('임시 비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  if (!email) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PasswordResetContainer direction="column" justifyContent="space-between" width="500px">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
            >
              오류
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'error.main' }}>
              이메일 정보가 없습니다. 비밀번호 재설정을 다시 시도해주세요.
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => navigate(ROUTE_OBJECTS.signIn.path)}
            >
              로그인 페이지로 돌아가기
            </Button>
          </Card>
        </PasswordResetContainer>
      </Box>
    );
  }

  if (showChangePassword) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PasswordResetContainer direction="column" justifyContent="space-between" width="500px">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', mb: 2 }}
            >
              새 비밀번호 설정
            </Typography>
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
              보안을 위해 새로운 비밀번호를 설정해주세요.
            </Typography>
            <ChangePassword />
          </Card>
        </PasswordResetContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <PasswordResetContainer direction="column" justifyContent="space-between" width="500px">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            비밀번호 재설정
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
            <b>{email}</b>로 전송된 임시 비밀번호를 입력해주세요.
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: timeLeft <= 60 ? 'error.main' : 'warning.main',
                fontWeight: 'bold'
              }}
            >
              남은 시간: {formatTime(timeLeft)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              임시 비밀번호는 3분 후 만료됩니다.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="temporaryPassword"
                type="password"
                name="temporaryPassword"
                placeholder="임시 비밀번호를 입력하세요"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                value={temporaryPassword}
                onChange={(e) => setTemporaryPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
              계속하기
            </Button>
          </Box>
        </Card>
      </PasswordResetContainer>
    </Box>
  );
}