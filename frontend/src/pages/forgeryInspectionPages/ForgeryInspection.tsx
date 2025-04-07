import { Routes, Route, useNavigate } from 'react-router-dom';
import forgeryInspectionChildren from './forgeryInspectionChildren';
import { useRef, useState } from 'react';
import api from '@/apis/axios';
import { AxiosError } from 'axios';

interface forgeryTestResponseProps {
  success: boolean;
  data: string; // success/fail 위조 여부부
  error: string;
  timestamp: string;
}

export const ForgeryInspection = () => {
  const fileRef = useRef<File | null>(null);
  const forgeryTestResponceRef = useRef<forgeryTestResponseProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 라우팅 훅
  const navigate = useNavigate();

  // 파일 설정 핸들러 - 자식 컴포넌트에서 호출
  const handleFileSelect = (selectedFile: File | null) => {
    fileRef.current = selectedFile;
    // 파일이 없으면 에러 메시지 초기화
    if (!selectedFile) {
      setError(null);
    }
  };

  const onUploadClick = async () => {
    if (!fileRef.current) {
      setError('파일을 선택해주세요.');
      return;
    }
    try {
      setError(null);
      navigate('waiting');

      // waiting 화면 시작 시간 기록
      const waitingStartTime = Date.now();

      const formData = new FormData();
      formData.append('file', fileRef.current);
      const response = await api.post('/api/verification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      forgeryTestResponceRef.current = response.data;
      console.log('API 응답:', response.data);

      // 최소 대기 시간 계산 (2초)
      const elapsedTime = Date.now() - waitingStartTime;
      const minWaitTime = 2000; // 2초

      // 필요한 경우 추가 대기
      if (elapsedTime < minWaitTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minWaitTime - elapsedTime)
        );
      }

      navigate('result');
    } catch (e) {
      if (e instanceof AxiosError) {
        // 400 에러는 정상 응답으로 처리하고 result 페이지로 이동
        if (e.response?.status === 400) {
          const waitingStartTime = Date.now();
          forgeryTestResponceRef.current = e.response.data;
          console.log('API 400 응답(가짜 문서):', e.response.data);

          // 최소 대기 시간 계산 (2초)
          const elapsedTime = Date.now() - waitingStartTime;
          const minWaitTime = 2000; // 2초

          // 필요한 경우 추가 대기
          if (elapsedTime < minWaitTime) {
            await new Promise((resolve) =>
              setTimeout(resolve, minWaitTime - elapsedTime)
            );
          }

          navigate('result');
          return;
        }

        // 다른 에러는 처리
        setError(
          e.response?.data?.message || '파일 업로드 중 오류가 발생했습니다.'
        );
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
      // 에러 발생 시 업로드 화면으로 돌아감
      navigate('/');
    }
  };

  // 리셋 핸들러
  const handleReset = () => {
    fileRef.current = null;
    forgeryTestResponceRef.current = null;
    setError(null);
    const origin = sessionStorage.getItem('origin');
    sessionStorage.removeItem('origin');
    if (origin && origin === 'ssafy') {
      navigate('/ssafy');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative flex flex-1">
      <Routes>
        <Route
          path="/"
          element={
            <forgeryInspectionChildren.FileUpload
              onFileSelect={handleFileSelect}
              onUploadClick={onUploadClick}
              externalError={error}
            />
          }
        />
        <Route path="waiting" element={<forgeryInspectionChildren.Waiting />} />
        <Route
          path="result"
          element={
            <forgeryInspectionChildren.Result
              fileTitle={fileRef.current?.name}
              result={forgeryTestResponceRef.current?.success}
              onReset={handleReset}
            />
          }
        />
      </Routes>
    </div>
  );
};
