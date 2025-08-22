import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import { type UserRole, UserRoleLabel } from '../../types/common';
import { useCallback } from 'react';

interface Props {
  onChangeFilter: (filter: {
    emailLike?: string;
    roleEqual?: UserRole;
    locked?: boolean;
    sortBy?: string;
    sortDirection?: 'ASCENDING' | 'DESCENDING';
  }) => void;
}

export default function UserListFilter({ onChangeFilter }: Props) {
  const width = 200;

  const handleChangeKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter({ emailLike: e.target.value });
    },
    [onChangeFilter],
  );

  const handleChangeRole = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === 'all') {
        onChangeFilter({ roleEqual: undefined });
      } else {
        onChangeFilter({ roleEqual: value as UserRole });
      }
    },
    [onChangeFilter],
  );

  const handleChangeIsLocked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === 'all') {
        onChangeFilter({ locked: undefined });
      } else {
        onChangeFilter({ locked: value === 'true' });
      }
    },
    [onChangeFilter],
  );

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 1,
        gap: 1,
        pr: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="이메일"
          variant="standard"
          size="small"
          sx={{ width: width }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          onChange={handleChangeKeyword}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="권한"
          variant="standard"
          size="small"
          select
          defaultValue={'all'}
          sx={{
            width: width,
          }}
          onChange={handleChangeRole}
        >
          <MenuItem value={'all'}>전체</MenuItem>
          <MenuItem value={'ADMIN'}>{UserRoleLabel.ADMIN}</MenuItem>
          <MenuItem value={'USER'}>{UserRoleLabel.USER}</MenuItem>
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="상태"
          variant="standard"
          size="small"
          select
          defaultValue="all"
          sx={{
            width: width,
          }}
          onChange={handleChangeIsLocked}
        >
          <MenuItem value={'all'}>전체</MenuItem>
          <MenuItem value={'false'}>활성</MenuItem>
          <MenuItem value={'true'}>잠금</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}
