// src/functions/KakaoShare.ts
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_API;

// ✅ Kakao 초기화
export const initializeKakao = () => {
  // SDK가 로드되어 있는지 확인
  if (!window.Kakao) {
    console.error("Kakao SDK가 로드되지 않았습니다.");
    return;
  }

  // 초기화
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
    console.log("✅ Kakao SDK 초기화 완료");
    console.log(window.Kakao);
  }
};

// ✅ 공유 함수
export const shareToKakao = (sender: string, pin_code: number, docType: string, id: string) => {
  // 초기화 확인
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
    return;
  }

  
  window.Kakao.Share.sendCustom({
    templateId: 118493,
    templateArgs: {
    //   title: '라이언이 즐겨먹던 바로 그 틴케이스 치즈볼',
    //   description: '바라만 봐도 즐거워지는 힐링 패키지에는 시크릿스토리가 숨어있어요.',
        sender: sender,
        pinCode: pin_code,
        docType: docType,
        id: id,
    },
  });
};
