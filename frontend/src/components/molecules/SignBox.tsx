import React, { useRef, useState, useEffect } from 'react';
import ShortButton from '../atoms/buttons/ShortButton';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription.tsx';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';

export const SignBox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getOffset = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const { x, y } = getOffset(e);
      startDrawing(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const { x, y } = getOffset(e);
      draw(x, y);
    };

    const handleEnd = () => {
      endDrawing();
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [isRotated]);

  const renderCanvas = () => (
    <div className="relative w-full flex-1 rounded-lg border border-black bg-gray-200">
      <canvas ref={canvasRef} className="h-full w-full touch-none" />
      <div className="pointer-events-none absolute left-0 top-1/2 w-full border-t border-dotted border-gray-500"></div>
      <div className="pointer-events-none absolute left-1/2 top-0 h-full border-l border-dotted border-gray-500"></div>
    </div>
  );

  return isRotated ? (
    // 가로 모드 레이아웃
    <div className="flex h-[844px] w-[390px] flex-col items-center justify-between px-2 py-4">
      {renderCanvas()}
      <div className="flex h-1/4 w-full flex-col items-start justify-center">
        <div className="flex rotate-90 flex-col">
          <ShortButton
            children={'다시 입력'}
            colorType={'primary'}
            className={'mb-2 text-text-default'}
            onClick={clearCanvas}
          />
          <ShortButton
            children={'서명 완료'}
            colorType={'black'}
            className={'text-gray-white'}
          />
          <div
            onClick={handleRotate}
            className="mt-5 cursor-pointer justify-center text-center text-xs font-medium text-zinc-600 underline"
          >
            서명이 불편하신가요? 화면 돌리기
          </div>
        </div>
      </div>
    </div>
  ) : (
    // 세로 모드 레이아웃
    <div className="flex h-[844px] w-[390px] flex-col items-center justify-between px-2 py-4">
      <div className="mt-3 w-full">
        <DocsDescription
          title={'서명을 해주세요'}
          subTitle={''}
          description={'거의 다 왔어요!'}
        />
      </div>
      <div className="flex h-2/5 w-full flex-col">
        {renderCanvas()}
        <div className="flex justify-end">
          <ShortButton
            children={'다시 입력'}
            colorType={'primary'}
            className={'mx-0 mt-2 text-text-default'}
            onClick={clearCanvas}
          />
        </div>
      </div>
      <div className="w-full">
        <LongButton
          children={'서명 완료'}
          colorType={'black'}
          className={'mx-0 text-gray-white'}
          onClick={() => {}}
        />
        <div
          onClick={handleRotate}
          className="mt-2 cursor-pointer justify-center text-center text-md font-medium text-text-description underline"
        >
          서명이 불편하신가요? 화면 돌리기
        </div>
      </div>
    </div>
  );
};
