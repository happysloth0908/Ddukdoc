import { DocsDescription } from '@/components/atoms/infos/DocsDescription.tsx';
import { useEffect, useState, useRef } from 'react';
import { AdditionalFile } from '@/components/molecules/cards/AdditionalFile.tsx';
import { useParams } from 'react-router-dom';
import { apiClient, sendFileData } from '@/apis/mypage.ts';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { ApiResponse, FileData } from '@/types/mypage.ts';

interface apiResponse extends ApiResponse {
  data: FileData[];
}

const EtcFiles = () => {
  const { id } = useParams();
  const [files, setFiles] = useState<FileData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ALLOWED_EXTENSIONS = [
    'mp3',
    'wav',
    'acc',
    'm4a',
    'flac',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'pdf',
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (10MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      event.target.value = ''; // 입력값 초기화
      return;
    }

    // 여러 파일이 선택된 경우 처리
    if (event.target.files && event.target.files.length > 1) {
      alert('한 번에 하나의 파일만 업로드할 수 있습니다.');
      event.target.value = ''; // 입력값 초기화
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      alert('허용되지 않은 파일 형식입니다.');
      event.target.value = ''; // 입력값 초기화
      return;
    }

    try {
      if (id) {
        await sendFileData(parseInt(id), file);
        fetchFiles(); // 파일 목록 새로고침
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      event.target.value = ''; // 업로드 후 입력값 초기화
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get<apiResponse>(`/api/material/${id}`);
      console.log(response.data.data);
      const files = response.data.data.map((file: FileData) => ({
        ...file,
      }));
      setFiles(files);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    if (!id) return;

    try {
      const response = await apiClient.get(`/api/material/${id}/download`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/zip',
        },
      });

      // 응답 헤더 확인
      const contentDisposition = response.headers['Content-Disposition'];

      // 파일명 추출
      let filename = 'download.zip';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // 파일명 디코딩
      const decodedFilename = decodeURIComponent(filename);

      // Blob URL 생성
      const blobUrl = URL.createObjectURL(response.data);

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = decodedFilename;

      // 다운로드 실행
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleImageClick = async (fileId: number) => {
    try {
      const response = await apiClient.get<{ data: FileData }>(
        `api/material/${id}/${fileId}`
      );
      const base64 = response.data.data.file_content;
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      setSelectedImage(dataUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col">
      {/* 이미지 모달 */}
      {isModalOpen && selectedImage && (
        <div
          className="absolute -bottom-16 -left-8 -right-8 -top-16 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="h-full w-full p-4">
            <img
              src={selectedImage}
              alt="확대된 이미지"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
      <div className="mt-6 px-4">
        <DocsDescription
          title={'추가 자료 목록'}
          subTitle={''}
          description={'증빙 자료를 안정하게 저장해보세요'}
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {files.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            추가 자료가 없습니다
          </div>
        ) : (
          files.map((file) => {
            const isImage = [
              'jpg',
              'jpeg',
              'png',
              'gif',
              'bmp',
              'webp',
            ].includes(file.format.toLowerCase());
            return (
              <div
                key={file.material_id}
                className={`${isImage ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => {
                  if (isImage) {
                    handleImageClick(file.material_id);
                  }
                }}
              >
                <AdditionalFile
                  key={file.material_id}
                  data={file}
                  onDelete={(id) => {
                    setFiles(files.filter((file) => file.material_id !== id));
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      <div className="sticky bottom-0 px-4 py-4">
        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
          />
          <LongButton
            children={'자료 추가하기'}
            className="bg-primary-200"
            onClick={() => fileInputRef.current?.click()}
          />
          <LongButton
            children={'추가자료 다운로드(.zip)'}
            colorType={'black'}
            onClick={files.length === 0 ? undefined : handleDownload}
            className={
              files.length === 0 ? 'cursor-not-allowed opacity-50' : ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EtcFiles;
