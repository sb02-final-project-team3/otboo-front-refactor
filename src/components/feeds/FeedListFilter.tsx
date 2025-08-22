import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';
import { PrecipitationTypeLabel, SkyStatusLabel, type PrecipitationType, type SkyStatus } from '../../types/common';
import { useCallback } from 'react';

interface Props {
  onChangeFilter: (filter: {
    keywordLike?: string;
    skyStatusEqual?: SkyStatus;
    precipitationTypeEqual?: PrecipitationType;
    sortBy?: 'createdAt' | 'likeCount';
  }) => void;
}

export default function FeedListFilter({ onChangeFilter }: Props) {
  const width = 200;

  const onChagneKeyword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter({ keywordLike: e.target.value });
    },
    [onChangeFilter],
  );

  const onChangeSkyStatus = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter({ skyStatusEqual: e.target.value as SkyStatus });
    },
    [onChangeFilter],
  );

  const onChangePrecipitationType = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter({ precipitationTypeEqual: e.target.value as PrecipitationType });
    },
    [onChangeFilter],
  );

  const onChangeSortBy = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeFilter({ sortBy: e.target.value as 'createdAt' | 'likeCount' });
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
        zIndex: 1000,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="피드 검색"
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
          onChange={onChagneKeyword}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="날씨"
          variant="standard"
          size="small"
          select
          sx={{
            width: width,
          }}
          onChange={onChangeSkyStatus}
        >
          {Object.entries(SkyStatusLabel).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="강수"
          variant="standard"
          size="small"
          select
          sx={{
            width: width,
          }}
          onChange={onChangePrecipitationType}
        >
          {Object.entries(PrecipitationTypeLabel).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 1 }}>
        <TextField
          label="정렬"
          variant="standard"
          size="small"
          select
          defaultValue={'createdAt'}
          sx={{
            width: width,
          }}
          onChange={onChangeSortBy}
        >
          <MenuItem value={'createdAt'}>최신순</MenuItem>
          <MenuItem value={'likeCount'}>좋아요순</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}
