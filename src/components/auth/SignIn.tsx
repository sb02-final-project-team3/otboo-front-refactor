import { Box, Button, Divider, FormControl, FormLabel, Link, TextField, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useOAuth2 from '../../hooks/useOAuth';
import { ROUTE_OBJECTS } from '../../router';
import useAlertStore from '../../stores/alertStore';
import useAuthStore from '../../stores/authStore';
import { GoogleIcon, KakaoTalkIcon } from './CustomIcon';
import ForgotPassword from './ForgotPassword';

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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn() {
  const { oauth2 } = useOAuth2();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const { openErrorAlert } = useAlertStore();

  const { signIn, error, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    await signIn(data.get('email') as string, data.get('password') as string);
  };

  useEffect(() => {
    if (error) {
      openErrorAlert(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTE_OBJECTS.home.path);
    }
  }, [isAuthenticated]);

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('이메일 형식이 올바르지 않습니다.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignInContainer direction="column" justifyContent="space-between" width="500px">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
          >
            로그인
          </Typography>
          <ForgotPassword open={open} handleClose={handleClose} />
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
              <FormLabel htmlFor="email" sx={{ textAlign: 'left' }}>
                이메일
              </FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" sx={{ textAlign: 'left' }}>
                비밀번호
              </FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
              로그인
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              비밀번호를 잊으셨나요?
            </Link>
            <Typography sx={{ textAlign: 'center' }}>
              계정이 없으신가요?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate(ROUTE_OBJECTS.signUp.path)}
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                회원가입
              </Link>
            </Typography>
          </Box>
          <Divider>또는</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => oauth2('google')} startIcon={<GoogleIcon />}>
              Google로 계속하기
            </Button>
            <Button fullWidth variant="outlined" onClick={() => oauth2('kakao')} startIcon={<KakaoTalkIcon />}>
              Kakao로 계속하기
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </Box>
  );
}
