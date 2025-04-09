import api from '@/apis/axios';
import { create } from 'zustand';

interface SsafyMyData {
  id: number;
  name: string;
  email: string;
  social_provider: string;
  user_type: string;
}

interface SsafyMyStoreActions {
  data: SsafyMyData;
  setData: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useMyStore = create<SsafyMyStoreActions>((set, get) => ({
  data: {
    id: 0,
    name: '',
    email: '',
    social_provider: '',
    user_type: '',
  },
  loading: false,
  error: null,

  setData: async () => {
    // 이미 로딩 중이면 함수 종료
    if (get().loading) {
      console.log('loading 상태 true, checkAuthStatus 호출 안 함');
      return;
    }
    try {
      set({ loading: true });
      const response = await api.get('/어쩌구 정보 가져오기');
      console.log('API 응답:', response.data);
      if (response.data) {
        set({ data: response.data, error: null }); // 데이터 설정
      }
    } catch (err) {
      console.error('인증 확인 실패:', err);
      set({
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    } finally {
      console.log('loading 상태 false로 설정');
      set({ loading: false });
    }
  },
}));
