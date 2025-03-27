import { useEffect, useRef } from 'react';

export interface BottomRollupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
/*
사용예시

const ParentComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        특정 동작
      </button>
      <BottomRollup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        내용
      </BottomRollup>
    </div>
  );
};
 */

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
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 max-h-[90vh] min-h-[200px] transform overflow-hidden rounded-t-[20px] bg-white shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 상단 핸들 바 */}
        {/*<div className="relative h-8">*/}
        {/*  <div className="absolute left-1/2 top-[11px] h-[3px] w-32 -translate-x-1/2 rounded-full bg-zinc-600 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />*/}
        {/*</div>*/}

        {/* 컨텐츠 영역 */}
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomRollup;
