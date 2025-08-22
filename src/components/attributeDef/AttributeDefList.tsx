import {
  Box,
  Button,
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
import type { ClothesAttributeDefDto } from '../../types/clothes';
import HorizontalScrollList from '../common/HorizontalScrollList';
import AttributeDefListFilter from './AttributeDefListFilter';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

interface Props {
  attributeDefs: ClothesAttributeDefDto[];
  fetchMore?: () => Promise<void>;
  onClickRow?: (attributeDef: ClothesAttributeDefDto) => void;
  onClickAdd?: () => void;
  onChangeFilter?: (filter: { keywordLike?: string }) => void;
}

interface ColumnDef {
  field: string;
  headerName: string;
  width?: string;
  sortable?: boolean;
  render?: (value: ClothesAttributeDefDto) => React.ReactNode;
}

export default function AttributeDefList({
  attributeDefs,
  fetchMore = () => Promise.resolve(),
  onClickRow = () => {},
  onClickAdd = () => {},
  onChangeFilter = () => {},
}: Props) {
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore);

  const handleRequestSort = (field: string) => {
    setOrderBy(field);
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const columns: ColumnDef[] = [
    { field: 'name', headerName: '속성명', width: '200px', sortable: true },
    { field: 'createdAt', headerName: '생성일', width: '150px', sortable: true },
    {
      field: 'selectableValues',
      headerName: '선택 가능 값',
      width: '250px',
      render: (attributeDef) => {
        return (
          <HorizontalScrollList>
            {attributeDef.selectableValues.map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </HorizontalScrollList>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 1, gap: 1 }}>
        <AttributeDefListFilter onChangeFilter={onChangeFilter} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            mt: 1,
          }}
        >
          <Button variant="contained" color="primary" onClick={onClickAdd}>
            속성 추가
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ flexGrow: 1, overflow: 'auto', overflowX: 'auto' }}
        ref={infiniteScrollRef}
      >
        <Table sx={{ tableLayout: 'auto' }}>
          <TableHead
            sx={{ position: 'sticky', top: 0, backgroundColor: 'background.default', zIndex: 1000, height: '50px' }}
          >
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
            {attributeDefs.map((attributeDef) => (
              <TableRow
                key={attributeDef.id}
                onClick={() => onClickRow(attributeDef)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.render
                      ? column.render(attributeDef)
                      : attributeDef[column.field as keyof ClothesAttributeDefDto]}
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
