import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { useCallback } from 'react';
import { ClothesTypeLabel } from '../../types/clothes';
import HorizontalScrollList from '../common/HorizontalScrollList';
import type { OotdDto } from '../../types/common';

interface Props {
  ootd: OotdDto;
  onClickEdit?: () => void;
}

export default function OotdDetail({ ootd, onClickEdit }: Props) {
  const handleEdit = useCallback(() => onClickEdit?.(), [onClickEdit]);

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        transition: 'transform 0.2s',
        overflow: 'auto',
        boxShadow: 'none',
      }}
    >
      <CardMedia
        component="img"
        image={ootd.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
        sx={{ height: '50%', objectFit: 'contain' }}
      />
      <CardContent sx={{ height: '40%' }}>
        <Typography variant="h6" noWrap sx={{ mb: 1 }}>
          {ootd.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Box key={ootd.type} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ whiteSpace: 'nowrap', mr: 1 }}>
              타입
            </Typography>
            <HorizontalScrollList>
              {Object.entries(ClothesTypeLabel).map(([key, value]) => (
                <Chip key={key} label={value} size="small" color={key === ootd.type ? 'primary' : 'default'} />
              ))}
            </HorizontalScrollList>
          </Box>
          {ootd.attributes.map((attr) => (
            <Box
              key={attr.definitionId}
              sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ whiteSpace: 'nowrap', mr: 1 }}>
                {attr.definitionName}
              </Typography>
              <HorizontalScrollList>
                {attr.selectableValues?.map((value) => (
                  <Chip key={value} label={value} size="small" color={value === attr.value ? 'primary' : 'default'} />
                ))}
              </HorizontalScrollList>
            </Box>
          ))}
        </Box>
      </CardContent>

      {onClickEdit && (
        <CardActions sx={{ height: '10%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleEdit}>
            수정
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
