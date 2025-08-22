import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { Gender, ProfileDto, ProfileUpdateRequest } from '../../types/users';
import useWeatherAPILocation from '../../hooks/useWeatherAPILocation';
import ChangePassword from '../auth/ChangePassword';

const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

interface Props {
  profile: ProfileDto;
  updateProfile: (userId: string, request: ProfileUpdateRequest, imageFile?: File) => Promise<void>;
}

export default function ProfileManagementDetail({ profile, updateProfile }: Props) {
  // 깊은 복사를 위한 헬퍼 함수

  const [editedProfile, setEditedProfile] = useState<ProfileDto>(deepCopy(profile));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { location, refetchLocation } = useWeatherAPILocation();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      birthDate: value,
    }));
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      temperatureSensitivity: newValue as number,
    }));
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile((prevProfile) => ({
      ...prevProfile,
      gender: event.target.value as Gender,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedProfile((prevProfile) => ({ ...prevProfile, profileImageUrl: URL.createObjectURL(file) }));
      setImageFile(file);
    }
  };

  const handleSave = useCallback(() => {
    const request: ProfileUpdateRequest = {};
    if (editedProfile.name != profile.name) {
      request.name = editedProfile.name;
    }
    if (editedProfile.gender != profile.gender && editedProfile.gender != null) {
      request.gender = editedProfile.gender;
    }
    if (editedProfile.birthDate != profile.birthDate && editedProfile.birthDate != null) {
      request.birthDate = editedProfile.birthDate;
    }
    if (editedProfile.location != profile.location && editedProfile.location != null) {
      request.location = editedProfile.location;
    }
    if (
      editedProfile.temperatureSensitivity != profile.temperatureSensitivity &&
      editedProfile.temperatureSensitivity != null
    ) {
      request.temperatureSensitivity = editedProfile.temperatureSensitivity;
    }

    updateProfile(profile.userId, request, imageFile ?? undefined);
  }, [updateProfile, profile.userId, editedProfile, imageFile, location]);

  const handleCancel = () => {
    setEditedProfile(deepCopy(profile)); // 변경 사항 취소 (깊은 복사)
  };

  const handleLocationChange = useCallback(async () => {
    await refetchLocation();
  }, [refetchLocation]);

  useEffect(() => {
    if (location) {
      setEditedProfile((prevProfile) => ({ ...prevProfile, location: location }));
    }
  }, [location]);

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar src={editedProfile.profileImageUrl} sx={{ width: 100, height: 100, mb: 2 }} />
        <Button variant="outlined" component="label">
          이미지 변경
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
      </Box>

      <TextField label="닉네임" name="name" value={editedProfile.name} onChange={handleInputChange} fullWidth />

      <FormControl>
        <FormLabel id="gender-radio-group-label">성별</FormLabel>
        <RadioGroup
          row
          name="gender"
          value={editedProfile.gender}
          onChange={handleGenderChange}
          id="gender-radio-group"
        >
          <FormControlLabel value={'MALE'} control={<Radio />} label="남성" />
          <FormControlLabel value={'FEMALE'} control={<Radio />} label="여성" />
          <FormControlLabel value={'OTHER'} control={<Radio />} label="기타" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="생년월일"
        type="date"
        name="birthDate"
        value={editedProfile.birthDate} // Date 객체를 YYYY-MM-DD 형식으로 변환
        onChange={handleDateChange}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="위치"
        name="location"
        value={editedProfile.location?.locationNames.join(' ') ?? ''}
        fullWidth
        disabled
      />
      <Button variant="outlined" onClick={handleLocationChange}>
        현재 위치로 설정
      </Button>

      <Box>
        <InputLabel htmlFor="temperature-slider">온도 민감도 (0: 추위 많이 탐 ~ 5: 더위 많이 탐)</InputLabel>
        <Slider
          id="temperature-slider"
          value={editedProfile.temperatureSensitivity ?? 0}
          onChange={handleSliderChange}
          aria-labelledby="temperature-sensitivity-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={5}
        />
      </Box>

      <Button variant="outlined" color="error" onClick={() => setIsChangePasswordOpen(true)}>
        비밀번호 변경
      </Button>
      <Dialog
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 350,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle>비밀번호 변경</DialogTitle>
        <DialogContent>
          <ChangePassword />
        </DialogContent>
      </Dialog>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          초기화
        </Button>
      </Stack>
    </Stack>
  );
}
