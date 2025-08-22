import { Avatar, Box, Divider, Link, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { ROUTE_OBJECTS } from '../../router';
import useAuthStore from '../../stores/authStore';
import { useWebSocketStore } from '../../stores/websocketStore';
import type { DirectMessageDto } from '../../types/directMessages';
import useDirectMessageStore from '../../stores/directMessageStore';

interface Props {
  directMessages: DirectMessageDto[];
  receiverId: string;

  fetchMore?: () => Promise<void>;
}

export default function DirectMessageList({ directMessages, receiverId, fetchMore = () => Promise.resolve() }: Props) {
  const { authentication } = useAuthStore();
  const { infiniteScrollRef } = useInfiniteScroll(fetchMore, true);
  const { addDirectMessage, addedDirectMessages } = useDirectMessageStore();
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const handleClickProfile = useCallback(
    (userId: string) => {
      navigate(`${ROUTE_OBJECTS.profile.path}?userId=${userId}`);
    },
    [navigate],
  );

  const { send, isConnected, subscribe } = useWebSocketStore();

  useEffect(() => {
    if (!authentication) return;
    const destination = resolveDestination(authentication.userId, receiverId);
    subscribe(destination, (message) => {
      addDirectMessage(message);
    });
  }, [subscribe]);

  useEffect(() => {
    if (infiniteScrollRef.current) {
      infiniteScrollRef.current.scrollTo({
        top: infiniteScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [addedDirectMessages]);

  const resolveDestination = useCallback((senderId: string, receiverId: string) => {
    let dest = '/sub/direct-messages_';
    if (senderId.localeCompare(receiverId) < 0) {
      dest = dest.concat(senderId).concat('_').concat(receiverId);
    } else {
      dest = dest.concat(receiverId).concat('_').concat(senderId);
    }
    return dest;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected || !authentication) return;
      const message = {
        senderId: authentication.userId,
        receiverId,
        content,
      };
      send('/pub/direct-messages_send', message);
    },
    [authentication, isConnected, send, receiverId],
  );

  const isMyMessage = useCallback(
    (message: DirectMessageDto) => {
      return message.sender.userId === authentication?.userId;
    },
    [authentication],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          height: '100%',
          maxHeight: '99%',
          overflow: 'auto',
          width: '100%',
        }}
        ref={infiniteScrollRef}
      >
        {[...directMessages].reverse().map((directMessage) => (
          <Box key={directMessage.id} sx={{ display: 'flex', alignItems: 'top', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'top' }}>
              <Avatar src={directMessage.sender.profileImageUrl} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'top' }}>
              <Box>
                <Typography sx={{ maxHeight: '100px', overflow: 'hidden' }}>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickProfile(directMessage.sender.userId);
                    }}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                    }}
                  >
                    <Typography component="span" fontWeight="bold">
                      {isMyMessage(directMessage) ? '나' : directMessage.sender.name}
                    </Typography>
                  </Link>{' '}
                  {directMessage.content}
                </Typography>
                <Typography fontSize={14} fontWeight={'semibold'} color={'text.secondary'}>
                  {dayjs(directMessage.createdAt).format('YYYY년 M월 D일 HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        {addedDirectMessages.length > 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography textAlign={'right'} color="text.secondary" fontWeight="semibold">
                NEW
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
          </>
        )}
        {addedDirectMessages.map((directMessage) => (
          <Box key={directMessage.id} sx={{ display: 'flex', alignItems: 'top', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'top' }}>
              <Avatar src={directMessage.sender.profileImageUrl} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'top' }}>
              <Box>
                <Typography sx={{ maxHeight: '100px', overflow: 'hidden' }}>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickProfile(directMessage.sender.userId);
                    }}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                    }}
                  >
                    <Typography component="span" fontWeight="bold">
                      {isMyMessage(directMessage) ? '나' : directMessage.sender.name}
                    </Typography>
                  </Link>{' '}
                  {directMessage.content}
                </Typography>
                <Typography fontSize={14} fontWeight={'semibold'} color={'text.secondary'}>
                  {dayjs(directMessage.createdAt).format('YYYY년 M월 D일 HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ flexShrink: 0, marginTop: 1 }}>
        <TextField
          fullWidth
          rows={1}
          placeholder="메시지를 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && e.nativeEvent.isComposing === false && e.currentTarget.value !== '') {
              sendMessage(content);
              setContent('');
            }
          }}
        />
      </Box>
    </Box>
  );
}
