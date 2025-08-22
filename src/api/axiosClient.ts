import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { ROUTE_OBJECTS } from '../router';
import useAuthStore from '../stores/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().authentication?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FailedRequestPromise {
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: FailedRequestPromise[] = [];

const processQueue = (error: AxiosError | Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token ?? '');
    }
  });
  failedQueue = [];
};

const resolveError = (err: any): any => {
  if (err.response && err.response.data) {
    const errorResponse = err.response.data;
    console.log('errorResponse............', err);
    if (err.response.headers['otboo-request-id']) {
      errorResponse.requestId = err.response.headers['otboo-request-id'];
    }
    return errorResponse;
  }
  return err;
};

apiClient.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry: boolean };

    // 401 에러이고, 재시도 플래그가 없는 경우 (무한 루프 방지)
    if (error.response?.status === 401 && !originalRequest._retry && !error.config?.url?.includes('/auth/')) {
      // 재시도 플래그 설정
      if (originalRequest) {
        // originalRequest가 정의되어 있는지 확인
        originalRequest._retry = true;
      }

      // 갱신 중인 경우, 현재 요청을 큐에 추가하고 Promise 반환
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest as AxiosRequestConfig); // 새 토큰으로 원본 요청 재시도
          })
          .catch((err) => {
            return Promise.reject(resolveError(err));
          });
      }

      // 갱신 시작
      isRefreshing = true;

      try {
        // 4. 토큰 갱신 요청
        // refresh-token 엔드포인트와 응답 데이터 타입에 맞게 수정 필요
        await useAuthStore.getState().fetchRefreshToken();
        const accessToken = useAuthStore.getState().authentication?.accessToken;

        // 갱신 완료 후 큐에 있는 요청들 처리
        isRefreshing = false;
        processQueue(null, accessToken); // 큐에 있는 요청들을 새 토큰으로 재시도

        // 원본 요청을 새 토큰으로 재시도
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest as AxiosRequestConfig);
      } catch (refreshError: any) {
        // refreshError의 타입을 any로 지정하거나 더 구체적인 에러 타입으로 지정
        // 토큰 갱신 실패 시
        isRefreshing = false;
        processQueue(refreshError); // 큐에 있는 요청들도 에러 처리
        console.error('Failed to refresh token:', refreshError);
        // 로그인 페이지로 리다이렉트 또는 사용자에게 에러 메시지 표시
        window.location.href = `#${ROUTE_OBJECTS.signOut.path}`;
        return Promise.reject(resolveError(refreshError)); // 갱신 실패 에러 반환
      }
    }

    // 401이 아니거나 이미 재시도된 요청인 경우 원래 에러 반환
    return Promise.reject(resolveError(error));
  },
);

export default apiClient;
