import api from '@/apis/axios';
import { create } from 'zustand';

interface MyInfoData {
  name: string | null;
  email: string | null;
  region: string | null;
  retire_yn: string | null;
  category: string | null;
  project_name: string | null;
}

interface SsafyMyStoreActions {
  data: MyInfoData;
  setData: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useSsafyMyStore = create<SsafyMyStoreActions>((set, get) => ({
  data: {
    name: '',
    email: '',
    region: '',
    retire_yn: '',
    category: '',
    project_name: '',
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
      const response = await api.get('/api/ssafy/users/info');
      console.log('API 응답:', response.data);
      if (response.data.success) {
        set({ data: response.data.data, error: null }); // 데이터 설정
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
