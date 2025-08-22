import { useNavigate } from 'react-router';
import { ROUTE_OBJECTS } from '../../router';
import { Box, Typography, Button } from '@mui/material';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        접근 권한이 없습니다
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        해당 페이지에 접근할 수 있는 권한이 없습니다.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(ROUTE_OBJECTS.home.path)}
        sx={{
          px: 4,
          py: 1.5,
        }}
      >
        홈으로 돌아가기
      </Button>
    </Box>
  );
}
