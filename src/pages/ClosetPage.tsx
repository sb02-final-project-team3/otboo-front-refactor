import AddIcon from '@mui/icons-material/Add';
import { Box, Card, CardContent, Dialog, DialogContent, Grid, Paper, Tab, Tabs } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ClothesCard from '../components/clothes/ClothesCard';
import ClothesDetail from '../components/clothes/ClothesDetail';
import ClothesDetailEdit from '../components/clothes/ClothesDetailEdit';
import useClothesStore from '../stores/clothesStore';
import {
  type ClothesType,
  ClothesTypeLabel,
  type ClothesDto,
  type ClothesCreateRequest,
  type ClothesUpdateRequest,
} from '../types/clothes';
import useClothesAttributeDefinitionStore from '../stores/clothesAttributeDefStore';
import useAuthStore from '../stores/authStore';
import useAlertStore from '../stores/alertStore';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const initialType: ClothesType = 'TOP';

export default function ClosetPage() {
  const { authentication } = useAuthStore();
  const {
    clothesList,
    fetchClothes,
    updateClothes,
    addClothes,
    clear: clearClothes,
    fetchMore: fetchMoreClothes,
  } = useClothesStore();
  const {
    attributeDefinitions,
    fetchClothesAttributeDefs,
    clear: clearClothesAttributeDefs,
  } = useClothesAttributeDefinitionStore();
  const [type, setType] = useState<ClothesType>(initialType);
  const [selectedClothes, setSelectedClothes] = useState<ClothesDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { openAlert } = useAlertStore();
  const { infiniteScrollRef } = useInfiniteScroll(fetchMoreClothes);

  useEffect(() => {
    if (authentication?.userId) {
      fetchClothes({ ownerId: authentication.userId, typeEqual: initialType });
      fetchClothesAttributeDefs();
    }
    return () => {
      clearClothes();
      clearClothesAttributeDefs();
    };
  }, [fetchClothes, authentication?.userId, fetchClothesAttributeDefs, clearClothes, clearClothesAttributeDefs]);

  useEffect(() => {
    if (authentication?.userId) {
      clearClothes();
      fetchClothes({ ownerId: authentication.userId, typeEqual: type });
    }
  }, [type, authentication?.userId, fetchClothes, clearClothes]);

  const initialClothes: ClothesDto = useMemo(() => {
    return {
      id: '',
      type: type,
      ownerId: authentication?.userId ?? '',
      name: '',
      attributes: [],
    };
  }, [type, authentication?.userId]);

  const handleChange = useCallback((_event: React.SyntheticEvent, newValue: ClothesType) => {
    setType(newValue);
  }, []);

  const handleChangeClothes = useCallback(
    async (clothes: ClothesDto, imageFile?: File) => {
      if (clothes.id === '') {
        if (clothes.name === '') {
          openAlert({
            title: '입력값 오류',
            message: '이름을 입력해주세요.',
            type: 'warning',
          });
          return;
        }
        const request: ClothesCreateRequest = {
          ownerId: clothes.ownerId,
          name: clothes.name,
          type: clothes.type,
          attributes: clothes.attributes,
        };
        await addClothes(request, imageFile);
      } else {
        const request: ClothesUpdateRequest = {};
        if (clothes.name != selectedClothes?.name) {
          request.name = clothes.name;
        }
        if (clothes.type != selectedClothes?.type) {
          request.type = clothes.type;
        }
        if (clothes.attributes != selectedClothes?.attributes) {
          request.attributes = clothes.attributes;
        }
        await updateClothes(clothes.id, request, imageFile);
      }
      setSelectedClothes(null);
    },
    [addClothes, updateClothes, selectedClothes],
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={1} sx={{ p: 4, width: '100%', height: '100%' }}>
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
          <Tabs
            orientation="vertical"
            value={type}
            onChange={handleChange}
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: '150px',
              },
              overflow: 'auto',
            }}
          >
            {Object.entries(ClothesTypeLabel).map(([key, value]) => (
              <Tab key={key} label={value} value={key} />
            ))}
          </Tabs>
          <Box
            ref={infiniteScrollRef}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'left',
              flexWrap: 'wrap',
              gap: 1,
              p: 2,
              width: '100%',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid key={'isMyCloset'} size={{ xs: 12, md: 3 }}>
                <Card
                  sx={{
                    width: '100%',
                    height: 350,
                    transition: 'transform 0.2s',
                    backgroundColor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'primary.light',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      cursor: 'pointer',
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => {
                    setIsEditMode(true);
                    setSelectedClothes(initialClothes);
                  }}
                >
                  <CardContent sx={{ height: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <AddIcon sx={{ fontSize: 40, color: 'primary.light' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {clothesList
                .filter((c) => c.type === type)
                .map((c) => (
                  <Grid key={c.id} size={{ xs: 12, md: 3 }}>
                    <ClothesCard clothes={c} onSelect={setSelectedClothes} />
                  </Grid>
                ))}
            </Grid>
          </Box>
          <Dialog
            open={selectedClothes !== null}
            onClose={() => {
              setSelectedClothes(null);
              setIsEditMode(false);
            }}
            sx={{
              '& .MuiDialog-paper': {
                width: '30%',
                height: 'calc(80vh)',
                maxHeight: '80%',
                overflow: 'auto',
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
              {selectedClothes && !isEditMode && (
                <ClothesDetail clothes={selectedClothes} onClickEdit={() => setIsEditMode(true)} />
              )}
              {selectedClothes && isEditMode && (
                <ClothesDetailEdit
                  clothes={selectedClothes}
                  attributeDefinitions={attributeDefinitions}
                  onChange={handleChangeClothes}
                  onCancel={() => {
                    setIsEditMode(false);
                    if (selectedClothes.id === '') {
                      setSelectedClothes(null);
                    }
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Box>
  );
}
