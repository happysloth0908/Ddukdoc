import { create } from 'zustand';
import { DocData } from '@/types/mypage';

export interface SearchParams {
  keyword?: string;
  templateCode?: string;
  status?: string;
  createdAt?: string;
}

interface DocStore {
  receiveDocs: DocData[];
  sendDocs: DocData[];
  receivePage: number;
  sendPage: number;
  isLastReceivePage: boolean;
  isLastSendPage: boolean;
  isLoading: boolean;

  // 각각 독립된 필터
  receiveSearchParams: SearchParams;
  sendSearchParams: SearchParams;

  // "처음 로드" 여부
  isFirstReceiveLoad: boolean;
  isFirstSendLoad: boolean;

  setReceiveDocs: (docs: DocData[], isLastPage: boolean) => void;
  appendReceiveDocs: (docs: DocData[], isLastPage: boolean) => void;
  setSendDocs: (docs: DocData[], isLastPage: boolean) => void;
  appendSendDocs: (docs: DocData[], isLastPage: boolean) => void;

  setReceivePage: (page: number) => void;
  setSendPage: (page: number) => void;

  setLoading: (loading: boolean) => void;
  setReceiveSearchParams: (params: SearchParams) => void;
  setSendSearchParams: (params: SearchParams) => void;

  setIsFirstReceiveLoad: (val: boolean) => void;
  setIsFirstSendLoad: (val: boolean) => void;

  // 전체 리셋 (원하면 쓰고, 안 써도 됨)
  reset: () => void;

  // ✅ 부분 리셋(수신 전용)
  resetReceive: () => void;
  // ✅ 부분 리셋(발신 전용)
  resetSend: () => void;
}

export const useDocStore = create<DocStore>((set) => ({
  receiveDocs: [],
  sendDocs: [],
  receivePage: 1,
  sendPage: 1,
  isLastReceivePage: false,
  isLastSendPage: false,
  isLoading: false,

  receiveSearchParams: {},
  sendSearchParams: {},

  isFirstReceiveLoad: true,
  isFirstSendLoad: true,

  setReceiveDocs: (docs, isLastPage) =>
    set({
      receiveDocs: docs,
      isLastReceivePage: isLastPage,
    }),

  appendReceiveDocs: (docs, isLastPage) =>
    set((state) => ({
      receiveDocs: [...state.receiveDocs, ...docs],
      isLastReceivePage: isLastPage,
    })),

  setSendDocs: (docs, isLastPage) =>
    set({
      sendDocs: docs,
      isLastSendPage: isLastPage,
    }),

  appendSendDocs: (docs, isLastPage) =>
    set((state) => ({
      sendDocs: [...state.sendDocs, ...docs],
      isLastSendPage: isLastPage,
    })),

  setReceivePage: (page) => set({ receivePage: page }),
  setSendPage: (page) => set({ sendPage: page }),

  setLoading: (loading) => set({ isLoading: loading }),

  setReceiveSearchParams: (params) => set({ receiveSearchParams: params }),
  setSendSearchParams: (params) => set({ sendSearchParams: params }),

  setIsFirstReceiveLoad: (val) => set({ isFirstReceiveLoad: val }),
  setIsFirstSendLoad: (val) => set({ isFirstSendLoad: val }),

  // ✅ 전체 리셋
  reset: () =>
    set({
      receiveDocs: [],
      sendDocs: [],
      receivePage: 1,
      sendPage: 1,
      isLastReceivePage: false,
      isLastSendPage: false,
      isLoading: false,
      receiveSearchParams: {},
      sendSearchParams: {},
      isFirstReceiveLoad: true,
      isFirstSendLoad: true,
    }),

  // ✅ 부분 리셋: 수신
  resetReceive: () =>
    set((state) => ({
      receiveDocs: [],
      receivePage: 1,
      isLastReceivePage: false,
      isFirstReceiveLoad: true,
      receiveSearchParams: {},
      // 발신 관련은 그대로!
      sendDocs: state.sendDocs,
      sendPage: state.sendPage,
      isLastSendPage: state.isLastSendPage,
      isFirstSendLoad: state.isFirstSendLoad,
      sendSearchParams: state.sendSearchParams,
      // 로딩은 취향대로 (여기선 false로 둬도 됨)
      isLoading: false,
    })),

  // ✅ 부분 리셋: 발신
  resetSend: () =>
    set((state) => ({
      sendDocs: [],
      sendPage: 1,
      isLastSendPage: false,
      isFirstSendLoad: true,
      sendSearchParams: {},
      // 수신은 그대로!
      receiveDocs: state.receiveDocs,
      receivePage: state.receivePage,
      isLastReceivePage: state.isLastReceivePage,
      isFirstReceiveLoad: state.isFirstReceiveLoad,
      receiveSearchParams: state.receiveSearchParams,
      isLoading: false,
    })),
}));
