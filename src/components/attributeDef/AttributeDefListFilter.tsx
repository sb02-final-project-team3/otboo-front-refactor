import { Box, InputAdornment, TextField } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

interface Props {
  onChangeFilter: (filter: { keywordLike?: string }) => void;
}

export default function AttributeDefListFilter({ onChangeFilter }: Props) {
  const width = 200;

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
          label="검색"
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
          onChange={(e) => onChangeFilter({ keywordLike: e.target.value })}
        />
      </Box>
    </Box>
  );
}
