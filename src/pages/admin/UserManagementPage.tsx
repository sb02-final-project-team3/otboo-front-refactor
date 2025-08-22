import { Box, Dialog, DialogContent, Paper } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import UserEdit from '../../components/users/UserEdit';
import UserList from '../../components/users/UserList';
import type { UserDto } from '../../types/users';
import useUserStore from '../../stores/userStore';
import type { UserRole } from '../../types/common';
import { updateUserLock, updateUserRole } from '../../api/users';

export default function UserManagementPage() {
  const { users, fetchUsers, fetchMore, clear, params } = useUserStore();
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  useEffect(() => {
    fetchUsers();
    return () => {
      clear();
    };
  }, [fetchUsers, clear]);

  const handleClickRow = (user: UserDto) => {
    setSelectedUser(user);
  };

  const handleChangeUser = useCallback(
    (user: UserDto) => {
      if (selectedUser?.id === user.id) {
        if (user.role !== selectedUser.role) {
          updateUserRole(user.id, { role: user.role });
        }
        if (user.locked !== selectedUser.locked) {
          updateUserLock(user.id, { locked: user.locked });
        }
        setSelectedUser(null);
      }
    },
    [selectedUser],
  );

  const handleChangeFilter = useCallback(
    (filter: {
      emailLike?: string;
      roleEqual?: UserRole;
      locked?: boolean;
      sortBy?: string;
      sortDirection?: 'ASCENDING' | 'DESCENDING';
    }) => {
      const debounceTimer = setTimeout(() => {
        clear();
        const { emailLike, roleEqual, locked, sortBy, sortDirection } = params;
        fetchUsers({ emailLike, roleEqual, locked, sortBy, sortDirection, ...filter });
      }, 300);

      return () => clearTimeout(debounceTimer);
    },
    [fetchUsers, params],
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={1} sx={{ p: 4, width: '100%', height: '100%' }}>
        <UserList users={users} fetchMore={fetchMore} onClickRow={handleClickRow} onChangeFilter={handleChangeFilter} />
      </Paper>

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            width: '50%',
            height: 'fit-content',
            maxHeight: '80%',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          {selectedUser && (
            <UserEdit user={selectedUser} onChange={handleChangeUser} onCancel={() => setSelectedUser(null)} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
