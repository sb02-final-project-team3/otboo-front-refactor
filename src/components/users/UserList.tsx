import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useState } from 'react';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import type { UserDto } from '../../types/users';
import UserListFilter from './UserListFilter';
import type { UserRole } from '../../types/common';

interface Props {
  users: UserDto[];
  fetchMore?: () => Promise<void>;
  onClickRow?: (user: UserDto) => void;
  onChangeFilter?: (filter: {
    emailLike?: string;
    roleEqual?: UserRole;
    locked?: boolean;
    sortBy?: string;
    sortDirection?: 'ASCENDING' | 'DESCENDING';
  }) => void;
}

interface ColumnDef {
  field: string;
  headerName: string;
  width?: string;
  sortable?: boolean;
  render?: (value: UserDto) => React.ReactNode;
}

export default function UserList({
  users,
  fetchMore = () => Promise.resolve(),
  onClickRow = () => {},
  onChangeFilter = () => {},
}: Props) {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleRequestSort = (field: string) => {
    setOrderBy(field);
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const columns: ColumnDef[] = [
    { field: 'email', headerName: '이메일', width: '20%', sortable: true },
    { field: 'createdAt', headerName: '생성일', width: '20%', sortable: true },
    {
      field: 'locked',
      headerName: '상태',
      width: '10%',
      render: (user) => {
        return user.locked ? <Chip label="잠금" color="error" /> : <Chip label="활성" color="success" />;
      },
    },
    {
      field: 'role',
      headerName: '권한',
      width: '15%',
      sortable: true,
      render: (user) => {
        return <Chip label={user.role} color={user.role === 'ADMIN' ? 'primary' : 'default'} />;
      },
    },
  ];

  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <UserListFilter onChangeFilter={onChangeFilter} />
      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto' }} ref={infiniteScrollRef}>
        <Table sx={{ tableLayout: 'auto' }}>
          <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'background.default', zIndex: 1000 }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} width={column.width}>
                  {column.headerName}
                  {column.sortable && (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleRequestSort(column.field)}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'none',
                        }}
                      >
                        sorted descending
                      </Box>
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => onClickRow(user)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.render ? column.render(user) : user[column.field as keyof UserDto]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
