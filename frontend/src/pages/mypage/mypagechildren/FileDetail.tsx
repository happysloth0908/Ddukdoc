import { useParams } from 'react-router-dom';
import { apiClient } from '@/apis/mypage.ts';
import { useEffect, useState } from 'react';
import { ApiResponse, FileData } from '@/types/mypage.ts';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';

interface apiResponse extends ApiResponse {
  data: FileData;
}

const FileDetail = () => {
  const { id, fileId } = useParams();
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<FileData | null>(null);

  const fetchFile = async () => {
    const response = await apiClient.get<apiResponse>(
      `api/material/${id}/${fileId}`
    );

    setFile(response.data.data);
    const base64 = response.data.data.file_content;
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    setImage(dataUrl);
  };

  useEffect(() => {
    fetchFile();
  }, []);

  return (
    <div
      className={'flex flex-1 flex-col items-center justify-center space-y-4'}
    >
      <DocsDescription
        title={file?.title + '.' + file?.format || ''}
        subTitle={''}
        description={''}
      />
      <div className="flex h-5/6 w-full flex-col items-center justify-center rounded-lg bg-gray-200">
        {image && <img src={image} alt="상세 이미지" />}
      </div>
    </div>
  );
};

export default FileDetail;
