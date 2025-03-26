import React from 'react';
import MainPage from '@/assets/images/mainPage';

const DeviceFrame = () => {
  return (
    <div className="relative aspect-[316/150] h-auto w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-b from-[rgba(225,233,255,1)] to-[rgba(255,255,255,1)] shadow-md">
      {/* 이미지 컨테이너 */}
      <div className="absolute inset-0 flex items-end justify-between px-3 pb-0">
        <img
          src={MainPage.writeDoc}
          alt="Flexible screen with notifications"
          className="h-auto w-[65%] object-contain"
        />
        <img
          src={MainPage.writeDocSmall}
          alt="Two gradient smartphones"
          className="mb-24 mr-4 h-auto w-[14%] object-contain"
        />
      </div>

      {/* 텍스트 레이어 */}
      <div className="absolute inset-0 flex flex-col items-end justify-end pb-6 pr-8">
        <div className="mb-1 text-center text-xl font-extrabold text-black">
          문서 작성
        </div>
        <div className="text-center text-xs font-light text-black">
          간편하게 빠르게 문서 작성
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;
