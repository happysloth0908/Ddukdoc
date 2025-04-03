import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  error: Error | null;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  loading: true,
  error: null,

  checkAuthStatus: async () => {
    if (get().loading) return;
    try {
      set({ loading: true });
      // 백엔드에서 제공하는 인증 상태 확인 API 호출
      const response = await axios.get('/api/users/status', {
        withCredentials: true,
      });

      if (response.data && response.data.success) {
        set({ isLoggedIn: response.data.success, error: null });
      } else {
        set({ isLoggedIn: false, error: null });
      }
    } catch (err) {
      console.error('인증 확인 실패:', err);
      set({
        isLoggedIn: false,
        error: err instanceof Error ? err : new Error('Unknown error'),
      });
    } finally {
      set({ loading: false });
    }
  },

  // 로그아웃 함수
  logout: async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true });
      set({ isLoggedIn: false });
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  },
}));
