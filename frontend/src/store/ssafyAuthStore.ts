import { create } from 'zustand';
import api from '@/apis/axios';

interface SsafyAuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: Error | null;
  checkAuthStatus: () => Promise<void>;
}
export const useSsafyAuthStore = create<SsafyAuthState>((set, get) => ({
  isLoggedIn: false,
  loading: false,
  error: null,

  checkAuthStatus: async () => {
    if (get().loading) {
      console.log('loading 상태 true, checkAuthStatus 호출 안 함');
      // 이미 로딩 중이면 함수 종료
      return;
    }
    console.log('checkAuthStatus 호출됨');
    try {
      set({ loading: true });
      console.log('API 호출 전');
      const response = await api.get('/api/users/ssafy');
      console.log('API 응답:', response.data);

      if (response.data && response.data.success) {
        console.log('로그인 상태 true로 설정');
        set({ isLoggedIn: response.data.success, error: null });
      } else {
        console.log('로그인 상태 false로 설정');
        set({ isLoggedIn: false, error: null });
      }
    } catch (err) {
      console.error('인증 확인 실패:', err);
      set({
        isLoggedIn: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    } finally {
      console.log('loading 상태 false로 설정');
      set({ loading: false });
    }
  },
}));
