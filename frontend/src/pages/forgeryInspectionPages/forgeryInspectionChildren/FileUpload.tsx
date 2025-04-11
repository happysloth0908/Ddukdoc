import { useState, DragEvent, useEffect, ChangeEvent, FC } from 'react';
import LongButton from '@/components/atoms/buttons/LongButton';
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

// import api from '@/apis/axios';
// import { AxiosError } from 'axios';

// interface forgeryTestResponseProps {
//   success: boolean;
//   data: string; // success/fail
//   error: string;
//   timestamp: string;
// }

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onUploadClick: () => void;
  externalError?: string | null;
}

export const FileUpload: FC<FileUploadProps> = ({
  onFileSelect,
  onUploadClick,
  externalError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // const [forgeryTestResponse, setForgeryTestResponse] =
  //   useState<forgeryTestResponseProps>();

  // 현재 표시할 에러 (내부 에러 또는 외부에서 전달된 에러)
  const error = externalError || internalError;

  // PDF URL에 '#toolbar=0' 파라미터를 추가하여 툴바 숨기기
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      // setPdfUrl(url + '#toolbar=0&navpanes=0&scrollbar=0');
      setPdfUrl(url);

      // 컴포넌트가 언마운트될 때 URL 객체를 해제
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // 파일이 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    onFileSelect(file);
  }, [file, onFileSelect]);

  // 파일 타입 검증 함수
  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      setInternalError('PDF 파일만 업로드 가능합니다.');
      return false;
    }
    setInternalError(null);
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
    setInternalError(null);
    setPdfUrl(null);
  };

  const onNextClick = () => {
    // 부모 컴포넌트의 onUploadClick 함수 호출
    onUploadClick();
  };


  const renderPDF = () => {
    if (!pdfUrl) return null;

    return (
      // <iframe
      //   src={pdfUrl}
      //   className="h-full w-full border-0"
      //   title="PDF Viewer"
      // />
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <div className="w-full h-full mx-auto border rounded-lg shadow overflow-hidden bg-white">
          <Viewer fileUrl={pdfUrl}/>
        </div>
      </Worker>
    
    );
  };

  return (
   <div className="flex h-full w-full flex-col overflow-hidden">
   {/* 헤더 영역 */}
   <div className="py-6 text-info-large font-bold">
     <div className="">검증할 문서를</div>
     <div className="">업로드해주세요!</div>
   </div>
   
   <div className="flex-1 overflow-hidden flex items-center justify-center">
     {!file ? (
       <>
         <div
           className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors ${
             isDragging
               ? 'border-2 border-dashed border-primary-300 bg-primary-100'
               : 'border-gray-200 bg-gray-400 hover:border-gray-400'
           }`}
           onClick={() => document.getElementById('file-input')?.click()}
           onDragEnter={handleDragEnter}
           onDragLeave={handleDragLeave}
           onDragOver={handleDragOver}
           onDrop={handleDrop}
         >
           <p className="text-xl font-medium text-gray-700 text-center">
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

         {error && (
           <div className="mt-2 text-center text-status-warning">
             {error}
           </div>
         )}
       </>
     ) : (
       <div className="flex h-full max-h-[500px] overflow-hidden w-full flex-col">
         <div className="mb-2 flex items-center justify-between">
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

         <div className="flex-1 max-h-[calc(100vh-250px)] min-h-[300px] rounded-lg bg-white shadow-md">
           {renderPDF()}
         </div>

         <div className="mt-2 truncate text-center text-sm text-gray-500">
           {file.name} ({(file.size / 1024).toFixed(1)} KB)
         </div>
       </div>
     )}
   </div>
   
   <div className="mt-4 mb-8" onClick={onNextClick}>
     <LongButton colorType="black">다음</LongButton>
   </div>
 </div>
  );
};
