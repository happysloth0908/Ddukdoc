import { create } from 'zustand';

interface SsafyMyStore {
  id: number;
  name: string;
  email: string;
  social_provider: string;
  user_type: string;
}

interface SsafyMyStoreActions {
  data: SsafyMyStore;
  setData: (newData: SsafyMyStore) => void;
}

export const useSsafyMyStore = create<SsafyMyStoreActions>((set) => ({
  data: {
    id: 0,
    name: '',
    email: '',
    social_provider: '',
    user_type: '',
  },
  setData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
}));
