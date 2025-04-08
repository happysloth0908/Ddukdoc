import { create } from 'zustand';

interface ShareInfo {
  user_id: string;
  token: string;
  receiver_id: string;
  team_id: string;
  channel_id: string;
  setUser_id: (user_id: string) => void;
  setToken: (token: string) => void;
  setReceiver_id: (receiver_id: string) => void;
  setTeam_id: (team_id: string) => void;
  setChannel_id: (channel_id: string) => void;
}

export const useShareInfoStore = create<ShareInfo>((set) => ({
  user_id: '',
  token: '',
  receiver_id: '',
  team_id: '',
  channel_id: '',
  setUser_id: (user_id: string) => set({ user_id }),
  setToken: (token: string) => set({ token }),
  setReceiver_id: (receiver_id: string) => set({ receiver_id }),
  setTeam_id: (team_id: string) => set({ team_id }),
  setChannel_id: (channel_id: string) => set({ channel_id }),
}));
