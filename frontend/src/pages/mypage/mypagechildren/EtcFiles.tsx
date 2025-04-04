import { DocsDescription } from '@/components/atoms/infos/DocsDescription.tsx';
import { useEffect, useState } from 'react';
import { AdditionalFile } from '@/components/molecules/cards/AdditionalFile.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '@/apis/mypage.ts';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { ApiResponse, FileData } from '@/types/mypage.ts';

interface apiResponse extends ApiResponse {
  data: FileData[];
}

const EtcFiles = () => {
  const { id } = useParams();
  const [files, setFiles] = useState<FileData[]>([]);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get<apiResponse>(`/api/materials/${id}`);
      setFiles(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <button
        onClick={() => {
          fetchFiles();
        }}
      >
        새로고침
      </button>
      <div className="mt-10 px-4">
        <DocsDescription
          title={'추가 자료 목록'}
          subTitle={''}
          description={'증빙 자료를 안정하게 저장해보세요'}
        />
      </div>

      {/* 추가자료 카드 리스트에만 스크롤 적용 */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {files.map((file) => (
          <div
            key={file.material_id}
            className="cursor-pointer"
            onClick={() => navigate(`${file.material_id}`)} // 클릭 시 라우팅
          >
            <AdditionalFile data={file} />
          </div>
        ))}
      </div>

      {/* 항상 하단에 붙는 버튼 영역 */}
      <div className="sticky bottom-0 bg-white px-4 py-4">
        <div className="flex flex-col items-center space-y-2">
          <LongButton children={'자료 추가하기'} className="bg-primary-200" />
          <LongButton children={'자료 다운로드'} />
        </div>
      </div>
    </div>
  );
};

export default EtcFiles;
