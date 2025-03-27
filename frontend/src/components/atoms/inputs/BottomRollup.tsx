import { useEffect, useRef } from 'react';

export interface BottomRollupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomRollup = ({ isOpen, onClose, children }: BottomRollupProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    >
      {/* 어두운 배경 (클릭 시 닫힘) */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 바텀 시트 컨테이너 */}
      <div
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 max-h-[90vh] min-h-[200px] transform overflow-hidden rounded-t-[20px] bg-white shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} mx-auto w-full max-w-md`}
      >
        {/* 내용 영역 */}
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomRollup;
