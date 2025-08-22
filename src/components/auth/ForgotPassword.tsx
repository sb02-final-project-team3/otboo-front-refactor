import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { resetPassword } from '../../api/auth';
import { ROUTE_OBJECTS } from '../../router';
import useAlertStore from '../../stores/alertStore.ts';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {openErrorAlert} = useAlertStore();
  const handleSubmit = useCallback(async () => {
    if (!email || isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword({ email });
      // Initialize 3-minute timer in localStorage when API call succeeds
      const timerKey = `password_reset_timer_${email}`;
      const endTime = Date.now() + (3 * 60 * 1000); // 3 minutes from now
      localStorage.setItem(timerKey, endTime.toString());

      navigate(ROUTE_OBJECTS.passwordReset.path, { state: { email } });
    } catch (error) {
      openErrorAlert(error);
      setIsLoading(false); // Reset loading on error, keep dialog open
    } finally {
      handleClose(); // Close dialog on success
    }
  }, [email, navigate, isLoading, openErrorAlert, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit();
          },
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>이메일 주소를 입력하면 임시 비밀번호를 메일로 보내드립니다.</DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="이메일 주소"
          type="email"
          fullWidth
          disabled={isLoading}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose} disabled={isLoading}>취소</Button>
        <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '보내기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
