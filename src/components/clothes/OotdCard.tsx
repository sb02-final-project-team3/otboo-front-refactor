import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import type { OotdDto } from '../../types/common';
import HorizontalScrollList from '../common/HorizontalScrollList';

interface Props {
  ootd: OotdDto;
  onSelect?: (ootd: OotdDto) => void;
}

export default function OotdCard({ ootd, onSelect = () => {} }: Props) {
  return (
    <Card
      sx={{
        width: '100%',
        height: 350,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer',
          boxShadow: 2,
        },
      }}
      onClick={() => onSelect(ootd)}
    >
      <CardMedia component="img" image={ootd.imageUrl} sx={{ height: 250, objectFit: 'contain' }} />
      <CardContent>
        <Typography variant="h6" noWrap sx={{ mb: 1 }}>
          {ootd.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <HorizontalScrollList>
            {ootd.attributes.map((attr) => (
              <Chip
                key={attr.definitionId}
                label={`${attr.definitionName}: ${attr.value}`}
                size="small"
                color={'default'}
                sx={{
                  whiteSpace: 'nowrap',
                  fontWeight: 'semibold',
                }}
              />
            ))}
          </HorizontalScrollList>
        </Box>
      </CardContent>
    </Card>
  );
}
