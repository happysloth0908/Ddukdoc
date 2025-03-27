import { useState, DragEvent, useEffect, ChangeEvent } from 'react';
import LongButton from '@/components/atoms/buttons/LongButton';
import api from '@/apis/axios';
import { AxiosError } from 'axios';

interface forgeryTestResponseProps {
  success: boolean;
  data: string; // success/fail
  error: string;
  timestamp: string;
}

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [forgeryTestResponse, setForgeryTestResponse] =
    useState<forgeryTestResponseProps>();

  // PDF URL에 '#toolbar=0' 파라미터를 추가하여 툴바 숨기기
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url + '#toolbar=0&navpanes=0&scrollbar=0');

      // 컴포넌트가 언마운트될 때 URL 객체를 해제
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // 파일 타입 검증 함수
  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setError('PDF 파일만 업로드 가능합니다.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setPdfUrl(null);
  };

  const onUploadClick = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/verification', formData);
      setForgeryTestResponse(response.data);
      console.log('API 응답:', response.data);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(
          e.response?.data?.message || '파일 업로드 중 오류가 발생했습니다.'
        );
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // A4 비율 계산 (가로:세로 = 1:1.414)
  const A4_RATIO = 1.414;

  const renderPDF = () => {
    if (!pdfUrl) return null;

    return (
      <div
        className="relative w-full"
        style={{ paddingTop: `${A4_RATIO * 100}%` }}
      >
        <iframe
          src={pdfUrl}
          className="absolute left-0 top-0 h-full w-full border-0"
          title="PDF Viewer"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="py-10 text-info-large">
        <div className="">검증할 문서를</div>
        <div className="">업로드해주세요!</div>
      </div>
      <div className="flex-grow">
        {!file ? (
          <>
            <div
              className={`flex h-64 w-full max-w-3xl flex-1 cursor-pointer flex-col items-center justify-center rounded-lg transition-colors ${
                isDragging
                  ? 'border-2 border-dashed border-primary-300 bg-primary-100'
                  : 'border-gray-200 bg-gray-400 hover:border-gray-400'
              }`}
              onClick={() => document.getElementById('file-input')?.click()} // 클릭 시 파일 선택 창 열기
              onDragEnter={handleDragEnter} // 드래그한 요소가 영역에 들어왔을 때
              onDragLeave={handleDragLeave} // 드래그한 요소가 영역을 벗어났을 때
              onDragOver={handleDragOver} // 드래그한 요소가 영역 위에 있을 때 (계속 발생)
              onDrop={handleDrop} // 드래그한 요소를 영역에 놓았을 때
            >
              {/* 안내 텍스트 */}
              <p className="text-xl font-medium text-gray-700">
                파일을 끌어다 놓거나 클릭하여 업로드하세요
              </p>
              <p className="mt-2 text-sm text-gray-500">
                똑딱똑Doc으로 생성된 PDF 파일만 가능합니다
              </p>
              <input
                id="file-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* 에러 메시지 표시 */}
            {error && (
              <div className="mt-2 text-center text-status-warning">
                {error}
              </div>
            )}
          </>
        ) : (
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="max-w-[70%] truncate text-xl font-semibold"
                title={file.name}
              >
                {file.name}
              </h2>
              <button
                className="rounded bg-status-warning px-3 py-1 text-white hover:bg-opacity-90"
                onClick={removeFile}
              >
                파일 제거
              </button>
            </div>

            {/* PDF 렌더링 */}
            <div className="mx-auto flex max-h-[50vh] w-full max-w-md flex-1 overflow-hidden rounded-lg bg-white shadow-md">
              {renderPDF()}
            </div>

            <div className="mt-2 text-center text-sm text-gray-500">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          </div>
        )}
      </div>
      <div className="mb-20" onClick={onUploadClick}>
        <LongButton colorType="black">다음</LongButton>
      </div>
    </div>
  );
};
