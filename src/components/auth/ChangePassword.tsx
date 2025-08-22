import { useCallback, useState } from 'react';
import { changePassword } from '../../api/users';
import useAuthStore from '../../stores/authStore';
import { Box, Button, TextField } from '@mui/material';
import useAlertStore from '../../stores/alertStore';
import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const { authentication } = useAuthStore();
  const { openErrorAlert, openAlert } = useAlertStore();
  const navigate = useNavigate();

  const validatePassword = () => {
    let isValid = true;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleChangePassword = useCallback(async () => {
    if (!validatePassword()) {
      return;
    }

    if (newPassword !== confirmPassword) {
      openAlert({
        title: '비밀번호 변경 실패',
        message: '비밀번호가 일치하지 않습니다.',
        type: 'error',
      });
      return;
    }

    if (!authentication?.userId) {
      openAlert({
        title: '비밀번호 변경 실패',
        message: '사용자 정보가 없습니다.',
        type: 'error',
      });
      return;
    }

    try {
      await changePassword(authentication?.userId ?? '', { password: newPassword });
      openAlert({
        title: '비밀번호 변경 성공',
        message: '비밀번호가 변경되었습니다. 다시 로그인하세요.',
        type: 'success',
      });
      navigate(ROUTE_OBJECTS.signOut.path);
    } catch (error) {
      openErrorAlert(error);
      return;
    }
  }, [newPassword, confirmPassword, authentication]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
        <TextField
          label="새 비밀번호"
          value={newPassword}
          onChange={handleChangeNewPassword}
          error={passwordError}
          helperText={passwordErrorMessage}
          type="password"
        />
        <TextField
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
          type="password"
          helperText={
            confirmPassword.length > 0
              ? newPassword === confirmPassword
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 일치하지 않습니다.'
              : ''
          }
          error={confirmPassword.length > 0 && newPassword !== confirmPassword}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button variant="contained" onClick={handleChangePassword} sx={{ minWidth: 100, width: '120px' }}>
          비밀번호 변경
        </Button>
      </Box>
    </Box>
  );
}
