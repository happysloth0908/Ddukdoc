import { create } from 'zustand';

interface ShareInfo {
  user_id: string;
  token: string;
  receiver_id: string;
  team_id: string;
  channel_id: string;
  share_type: 'user' | 'channel' | null;
  setUser_id: (user_id: string) => void;
  setToken: (token: string) => void;
  setReceiver_id: (receiver_id: string) => void;
  setTeam_id: (team_id: string) => void;
  setChannel_id: (channel_id: string) => void;
  setShare_type: (type: 'user' | 'channel' | null) => void;
}

export const useShareInfoStore = create<ShareInfo>((set) => ({
  user_id: '',
  token: '',
  receiver_id: '',
  team_id: '',
  channel_id: '',
  share_type: null,
  setUser_id: (user_id: string) => set({ user_id }),
  setToken: (token: string) => set({ token }),
  setReceiver_id: (receiver_id: string) => set({ receiver_id }),
  setTeam_id: (team_id: string) => set({ team_id }),
  setChannel_id: (channel_id: string) => set({ channel_id }),
  setShare_type: (type: 'user' | 'channel' | null) => set({ share_type: type }),
}));
