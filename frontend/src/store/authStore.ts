import { create } from 'zustand';
import axios from 'axios';

interface UserProps {
  id: number;
  name: string;
  email: string;
  social_provider: string;
  is_new: boolean; // 회원가입인지 재로그인인
  user_type: string;
}

interface AuthState {
  user: UserProps | null;
  loading: boolean;
  error: Error | null;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  checkAuthStatus: async () => {
    try {
      set({ loading: true });
      // 백엔드에서 제공하는 인증 상태 확인 API 호출
      const response = await axios.get('api 엔드 포인트!!!!', {
        withCredentials: true,
      });

      if (response.data && response.data.data && response.data.data.user) {
        set({ user: response.data.data.user, error: null });
      } else {
        set({ user: null, error: null });
      }
    } catch (err) {
      console.error('인증 확인 실패:', err);
      set({
        user: null,
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
      set({ user: null });
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  },
}));
