import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { type UserDto } from '../../types/users';
import { UserRoleLabel, type UserRole } from '../../types/common';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  user: UserDto;
  onChange: (user: UserDto) => void;
  onCancel?: () => void;
}

export default function UserEdit({ user, onChange, onCancel }: Props) {
  const deepCopy = useCallback((obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  }, []);

  const [editedUser, setEditedUser] = useState<UserDto>(deepCopy(user));

  const clearChanges = useCallback(() => {
    setEditedUser(deepCopy(user));
  }, [user]);

  useEffect(() => {
    return () => {
      clearChanges();
    };
  }, [clearChanges]);

  const handleSubmit = useCallback(() => {
    onChange(editedUser);
  }, [editedUser, onChange]);

  return (
    <Box>
      <Stack spacing={3} sx={{ maxHeight: '60vh', overflow: 'auto', mb: 3, pt: 2 }}>
        <TextField label="이메일" value={editedUser.email} />
        <TextField
          label="권한"
          value={editedUser.role}
          select
          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as UserRole })}
          size="small"
        >
          {Object.entries(UserRoleLabel).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="상태"
          value={editedUser.locked}
          select
          onChange={(e) => setEditedUser({ ...editedUser, locked: e.target.value === 'true' })}
          size="small"
        >
          <MenuItem value="true">잠금</MenuItem>
          <MenuItem value="false">활성</MenuItem>
        </TextField>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
      </Box>
    </Box>
  );
}
