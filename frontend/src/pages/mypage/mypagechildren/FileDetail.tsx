import { useParams } from 'react-router-dom';
import { apiClient } from '@/apis/mypage.ts';
import { useEffect, useState } from 'react';
import { ApiResponse, FileData } from '@/types/mypage.ts';

interface apiResponse extends ApiResponse {
  data: FileData;
}

const FileDetail = () => {
  const { id } = useParams();
  const { fileId } = useParams();
  const [image, setImage] = useState('');
  const [file, setFile] = useState<FileData | null>(null);

  const fetchFile = async () => {
    const response = await apiClient.get<apiResponse>(
      `api/materials/${id}/${fileId}`
    );
    setFile(response.data.data);
    const base64 = response.data.data.file_url;
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    setImage(dataUrl);
  };

  useEffect(() => {
    fetchFile();
  }, []);

  return (
    <div className={'flex flex-1 items-center justify-center'}>
      <div className="flex h-5/6 w-full flex-col items-center justify-center rounded-lg bg-gray-200">
        <div>{file?.title}</div>
        <img src={image} alt="상세 이미지" />
      </div>
    </div>
  );
};

export default FileDetail;
