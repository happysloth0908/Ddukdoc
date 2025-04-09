import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShortButton from '../atoms/buttons/ShortButton';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription.tsx';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { useIOUDocsStore, useS1Data, useS6Data } from '@/store/docs';
import { Trash2 } from 'lucide-react';

interface SignBoxProps {
  next: string;
  role?: string;
  ssafy?: {
    isSsafy: boolean;
    template: string;
  };
}

export const SignBox: React.FC<SignBoxProps> = ({ next, role, ssafy }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const setSignature = useIOUDocsStore((state) =>
    role === '채권자' ? state.setCreditorSignature : state.setDebtorSignature
  );

  const setS1Signature = useS1Data((state) => state.setSignature);
  const setS6Signature = useS6Data((state) => state.setSignature);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // 회전 시 캔버스 이미지 복사 및 복원
  const handleRotate = () => {
    const canvas = canvasRef.current;
    let backupImage: string | null = null;

    if (canvas) {
      backupImage = canvas.toDataURL(); // 현재 서명 이미지 백업
    }

    setIsRotated((prev) => !prev);

    setTimeout(() => {
      resizeCanvas();

      if (backupImage && canvas) {
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = backupImage;
        image.onload = () => {
          const dpr = window.devicePixelRatio || 1;
          ctx?.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr);
        };
      }
    }, 100);
  };

  const getAdjustedCoordinates = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x, y };

    return { x, y };
  };

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getAdjustedCoordinates(x, y);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = getAdjustedCoordinates(x, y);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    if (width === 0 || height === 0) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  }, [isDrawing, isRotated]);

  // 최초 mount 시 canvas 사이즈 설정
  useEffect(() => {
    setTimeout(() => {
      resizeCanvas();
    }, 100);
  }, []);

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 가로 모드일 때 90도 회전하여 저장
    let signatureData;
    if (isRotated) {
      const rotatedCanvas = document.createElement('canvas');
      rotatedCanvas.width = canvas.height;
      rotatedCanvas.height = canvas.width;
      const ctx = rotatedCanvas.getContext('2d');
      if (ctx) {
        ctx.translate(0, rotatedCanvas.height);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(canvas, 0, 0);
      }
      signatureData = rotatedCanvas.toDataURL('image/png');
    } else {
      signatureData = canvas.toDataURL('image/png');
    }

    if (ssafy?.isSsafy) {
      switch (ssafy.template) {
        case 'S1':
          setS1Signature(signatureData);
          break;

        case 'S6':
          setS6Signature(signatureData);
          break;
      }
    } else {
      setSignature(signatureData); // Zustand에 저장
    }
    navigate(next, { state: { from: currentPath } });
  };

  const renderCanvas = () => (
    <div className="relative w-full flex-1 rounded-lg border border-black bg-gray-200">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ minHeight: 200 }}
      />
      <div className="pointer-events-none absolute left-0 top-1/2 w-full border-t border-dotted border-gray-500" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full border-l border-dotted border-gray-500" />
      <div
        onClick={clearCanvas}
        className={`absolute cursor-pointer rounded-full bg-white p-2 shadow-md hover:bg-gray-100 ${
          isRotated ? 'bottom-2 right-2 rotate-90' : 'right-2 top-2'
        }`}
      >
        <Trash2 className="h-5 w-5 text-gray-600" />
      </div>
    </div>
  );

  return (
    <>
      {isRotated ? (
        // 가로 모드 레이아웃
        <div className="flex h-full w-full flex-col items-center justify-between px-2 py-4">
          {renderCanvas()}
          <div className="flex h-1/4 w-full flex-col items-start justify-center">
            <div className="flex rotate-90 flex-col">
              <ShortButton
                children={'서명 완료'}
                colorType={'black'}
                className={'text-gray-white'}
                onClick={saveSignature}
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
        <div className="flex h-full w-full flex-col items-center justify-between px-2">
          <div className="mt-3 w-full">
            <DocsDescription
              title={'서명을 해주세요'}
              subTitle={''}
              description={'거의 다 왔어요!'}
            />
          </div>
          <div className="flex h-2/5 w-full flex-col">{renderCanvas()}</div>
          <div className="mb-20 w-full">
            <LongButton
              children={'서명 완료'}
              colorType={'black'}
              className={'mx-0 text-gray-white'}
              onClick={saveSignature}
            />
            <div
              onClick={handleRotate}
              className="mt-2 cursor-pointer justify-center text-center text-md font-medium text-text-description underline"
            >
              서명이 불편하신가요? 화면 돌리기
            </div>
          </div>
        </div>
      )}
    </>
  );
};
