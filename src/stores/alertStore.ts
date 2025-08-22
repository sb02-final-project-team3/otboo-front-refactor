import { create } from 'zustand';

interface Alert {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AlertStore {
  alert: Alert | null;
  openAlert: (alert: Alert) => void;
  openErrorAlert: (err: any) => void;
  closeAlert: () => void;
}

const useAlertStore = create<AlertStore>((set) => ({
  alert: null,
  openAlert: (alert) => set({ alert }),
  openErrorAlert: (err) =>
    set({
      alert: {
        title: '에러가 발생했습니다.',
        message: `- 예외 이름: ${err.exceptionName}\n- 메시지: ${err.message}\n- 요청 ID: ${err.requestId}`,
        type: 'error',
      },
    }),
  closeAlert: () => set({ alert: null }),
}));

export default useAlertStore;
