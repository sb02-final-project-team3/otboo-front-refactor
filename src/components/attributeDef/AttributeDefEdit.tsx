import { useCallback, useEffect, useState } from 'react';
import type { ClothesAttributeDefDto } from '../../types/clothes';
import { Box, Button, Chip, Stack, TextField } from '@mui/material';

interface Props {
  attributeDef: ClothesAttributeDefDto;
  onChange: (attributeDef: ClothesAttributeDefDto) => void;
  onCancel?: () => void;
}

export default function AttributeDefEdit({ attributeDef, onChange, onCancel }: Props) {
  const deepCopy = useCallback((obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  }, []);

  const [editedAttributeDef, setEditedAttributeDef] = useState<ClothesAttributeDefDto>(deepCopy(attributeDef));

  const clearChanges = useCallback(() => {
    setEditedAttributeDef(deepCopy(attributeDef));
  }, [attributeDef]);

  useEffect(() => {
    return () => {
      clearChanges();
    };
  }, [clearChanges]);

  const handleSubmit = useCallback(() => {
    onChange(editedAttributeDef);
  }, [editedAttributeDef, onChange]);

  return (
    <Box>
      <Stack spacing={3} sx={{ maxHeight: '60vh', overflow: 'auto', mb: 3, pt: 4 }}>
        <TextField
          label="속성명"
          value={editedAttributeDef.name}
          onChange={(e) => setEditedAttributeDef({ ...editedAttributeDef, name: e.target.value })}
        />
        <TextField
          label="선택 가능 값"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && (e.target as HTMLInputElement).value && !e.nativeEvent.isComposing) {
              setEditedAttributeDef({
                ...editedAttributeDef,
                selectableValues: [
                  ...new Set([...editedAttributeDef.selectableValues, (e.target as HTMLInputElement).value]),
                ],
              });
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <Box>
          {editedAttributeDef.selectableValues.map((value) => (
            <Chip
              key={value}
              label={value}
              onDelete={() =>
                setEditedAttributeDef({
                  ...editedAttributeDef,
                  selectableValues: editedAttributeDef.selectableValues.filter((v) => v !== value),
                })
              }
            />
          ))}
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
      </Box>
    </Box>
  );
}
