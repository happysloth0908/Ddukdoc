import { useParams } from 'react-router-dom';
import { apiClient } from '@/apis/mypage.ts';
import { useEffect, useState } from 'react';

interface ApiResponse {
  success: boolean;
  data: FileData;
  error: null;
  timestamp: string;
}

interface FileData {
  material_id: number;
  title: string;
  user_id: number;
  user_name: string;
  file_url: string;
  format: string;
  created_at: string;
  updated_at: string;
}

const FileDetail = () => {
  const { id } = useParams();
  const { fileId } = useParams();
  const [image, setImage] = useState('');
  const [file, setFile] = useState<FileData | null>(null);

  const fetchFile = async () => {
    const response = await apiClient.get<ApiResponse>(
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
        <img src={image} alt="서버에서 받은 이미지" />
      </div>
    </div>
  );
};

export default FileDetail;
