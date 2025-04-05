import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SsafyLoginSVG } from "@/assets/images/ssafy";
import SmallButton from "@/pages/mainPage/mainChildren/SmallButton";

export const SsafyMain = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center p-4 min-h-screen">
      {/* 제목 */}
      <div className="w-full flex justify-center mb-8 mt-10">
        <img src={SsafyLoginSVG.ssafy_title} alt="SSAFY Title" />
      </div>
      
      {/* 2*2 블록들 - 여기에 mt-8 추가하여 아래로 내림 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-8">
        {/* 블록 1 */}
        <div className="aspect-square flex items-center justify-center rounded-lg">
          <img src={SsafyLoginSVG.ssafy_logo} className="opacity-50 max-w-full max-h-full p-4" alt="SSAFY Logo" />
        </div>
        
        {/* 블록 2 */}
        <div className="aspect-square flex items-center justify-center rounded-lg shadow-sm">
          <SmallButton 
            imageSrc={SsafyLoginSVG.ssafy_myhome_icon} 
            subtitle="나의 싸피 문서함" 
            title="내 문서" 
          />
        </div>
        
        {/* 블록 3 */}
        <div className="aspect-square flex items-center justify-center rounded-lg shadow-sm">
          <SmallButton 
            imageSrc={SsafyLoginSVG.ssafy_forgery_icon} 
            subtitle="블록체인 기술로 위변조 검사" 
            title="위변조 검사" 
          />
        </div>
        
        {/* 블록 4 */}
        <div className="aspect-square flex items-center justify-center rounded-lg shadow-sm">
          <SmallButton 
            imageSrc={SsafyLoginSVG.ssafy_docs_icon} 
            subtitle="빠르고 쉽게 문서 작성" 
            title="문서 작성" 
          />
        </div>
      </div>
      
      {/* 약관 - flex-grow-1과 mt-auto를 사용하여 맨 아래로 배치 */}
      <div className="text-sm text-text-description mt-auto py-8"> 
        뚝딱뚝Doc 이용약관
      </div>
    </div>
  );
};