import { Box, Dialog, DialogContent, Paper } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AttributeDefList from '../../components/attributeDef/AttributeDefList';
import AttributeDefEdit from '../../components/attributeDef/AttributeDefEdit';
import useClothesAttributeDefinitionStore from '../../stores/clothesAttributeDefStore';
import type { ClothesAttributeDefDto } from '../../types/clothes';

export default function AttributeDefManagementPage() {
  const {
    attributeDefinitions,
    fetchClothesAttributeDefs,
    fetchMore,
    addClothesAttributeDef,
    updateClothesAttributeDef,
    clear,
  } = useClothesAttributeDefinitionStore();
  const [selectedAttributeDef, setSelectedAttributeDef] = useState<ClothesAttributeDefDto | null>(null);

  useEffect(() => {
    fetchClothesAttributeDefs();
    return () => {
      clear();
    };
  }, [fetchClothesAttributeDefs, clear]);

  const initialAttributeDefinition: ClothesAttributeDefDto = useMemo(() => {
    return {
      id: '',
      name: '',
      description: '',
      type: 'STRING',
      createdAt: '',
      selectableValues: [],
    };
  }, []);

  const handleClickRow = (attributeDef: ClothesAttributeDefDto) => {
    setSelectedAttributeDef(attributeDef);
  };

  const handleChangeAttributeDef = useCallback(
    async (attributeDef: ClothesAttributeDefDto) => {
      if (selectedAttributeDef?.id) {
        updateClothesAttributeDef(selectedAttributeDef.id, attributeDef);
      } else {
        addClothesAttributeDef(attributeDef);
      }
      setSelectedAttributeDef(null);
    },
    [selectedAttributeDef, addClothesAttributeDef, updateClothesAttributeDef],
  );

  const handleAddButtonClick = useCallback(() => {
    setSelectedAttributeDef(initialAttributeDefinition);
  }, [initialAttributeDefinition]);

  const handleChangeFilter = useCallback(
    (filter: { keywordLike?: string }) => {
      const debounceTimer = setTimeout(() => {
        clear();
        fetchClothesAttributeDefs(filter);
      }, 300);

      return () => clearTimeout(debounceTimer);
    },
    [fetchClothesAttributeDefs, clear],
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
        <AttributeDefList
          attributeDefs={attributeDefinitions}
          fetchMore={fetchMore}
          onClickRow={handleClickRow}
          onClickAdd={handleAddButtonClick}
          onChangeFilter={handleChangeFilter}
        />
      </Paper>

      <Dialog
        open={!!selectedAttributeDef}
        onClose={() => setSelectedAttributeDef(null)}
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
          {selectedAttributeDef && (
            <AttributeDefEdit
              attributeDef={selectedAttributeDef}
              onChange={handleChangeAttributeDef}
              onCancel={() => setSelectedAttributeDef(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
