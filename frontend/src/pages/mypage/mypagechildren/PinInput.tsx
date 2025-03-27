import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';

const PinInput: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  const correctPin = '123456'; // 예시: 정답 PIN

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === correctPin) {
        alert('다음 화면으로 이동합니다!');
        setPin('');
        setError(false);
      } else {
        // 잘못된 핀 → shake 애니메이션, 에러 표시
        setShake(true);
        setError(true);

        // 0.5초 후 상태 초기화
        setTimeout(() => {
          setShake(false);
          setPin('');
        }, 500);
      }
    }
  }, [pin]);

  const handleClick = (val: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const numberLayout: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '',
    '0',
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-6 bg-white px-4 text-center">
      {/* 안내 문구 */}
      <div className="mb-6">
        <p className="text-sm font-semibold">랜덤님이</p>
        <p className="text-sm">파리바게트 근로계약서를 보냈어요!</p>
      </div>

      <p className="mb-4 text-gray-500">핀번호를 입력해주세요</p>

      {/* PIN 점 + shake 애니메이션 */}
      <div
        className={`mb-2 flex justify-center gap-2 ${shake ? 'animate-shake' : ''}`}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border border-gray-400 transition ${
              pin.length > i ? 'bg-black' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mb-6 text-xs text-red-500">핀 번호를 잘못 입력했어요</p>
      )}

      {/* 숫자 키패드 */}
      <div className="grid grid-cols-3 text-xl">
        {numberLayout.map((num, idx) => (
          <button
            key={idx}
            onClick={() => num && handleClick(num)}
            className="h-20 w-24 hover:bg-gray-100"
          >
            {num}
          </button>
        ))}

        {/* backspace 버튼을 마지막 셀에 배치 */}
        <button
          onClick={handleBackspace}
          className="flex h-20 w-24 items-center justify-center text-xl hover:bg-gray-100"
        >
          <Delete />
        </button>
      </div>
    </div>
  );
};

export default PinInput;
