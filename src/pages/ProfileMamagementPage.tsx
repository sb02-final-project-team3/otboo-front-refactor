import { Box, Paper } from '@mui/material';
import ProfileManagementDetail from '../components/profiles/ProfileManagementDetail';
import { useCallback, useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import type { ProfileUpdateRequest } from '../types/users';
import useAlertStore from '../stores/alertStore';
import useMyProfileStore from '../stores/myProfileStore.ts';

export default function ProfileMamagementPage() {
  const { authentication } = useAuthStore();
  const { myProfile, fetchMyProfile, clear, updateProfile, error } = useMyProfileStore();
  const { openAlert, openErrorAlert } = useAlertStore();
  useEffect(() => {
    if (authentication) {
      fetchMyProfile();
    }
    return () => {
      clear();
    };
  }, [fetchMyProfile, authentication]);

  const handleUpdateProfile = useCallback(
    async (userId: string, request: ProfileUpdateRequest, imageFile?: File) => {
      await updateProfile(userId, request, imageFile);
      openAlert({
        title: '프로필 업데이트 완료',
        message: '프로필이 업데이트되었습니다.',
        type: 'success',
      });
    },
    [updateProfile],
  );

  useEffect(() => {
    if (error) {
      openErrorAlert(error);
    }
  }, [error]);

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
        <Box sx={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          {myProfile && <ProfileManagementDetail profile={myProfile} updateProfile={handleUpdateProfile} />}
        </Box>
      </Paper>
    </Box>
  );
}
