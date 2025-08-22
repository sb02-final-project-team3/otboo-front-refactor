import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import type { ClothesDto } from '../../types/clothes';
import HorizontalScrollList from '../common/HorizontalScrollList';

interface Props {
  clothes: ClothesDto;
  onSelect?: (clothes: ClothesDto) => void;
}

export default function ClothesCard({ clothes, onSelect = () => {} }: Props) {
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
      onClick={() => onSelect(clothes)}
    >
      <CardMedia component="img" image={clothes.imageUrl} sx={{ height: 250, objectFit: 'contain' }} />
      <CardContent>
        <Typography variant="h6" noWrap sx={{ mb: 1 }}>
          {clothes.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <HorizontalScrollList>
            {clothes.attributes.map((attr) => (
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
