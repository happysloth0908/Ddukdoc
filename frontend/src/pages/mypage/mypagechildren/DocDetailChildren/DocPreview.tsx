import { apiClient } from '@/apis/mypage';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ApiResponse } from '@/types/mypage';
import atoms from '@/components/atoms';
import Spinner from '@/components/atoms/feedback/Spinner';
import { FolderPlus, ArrowDownToLine } from 'lucide-react';

interface errorResponse extends ApiResponse {
  data: null;
}

const DocPreview = () => {
  const [pdfUrl, setPdfUrl] = useState<string>();
  const pdfUrlRef = useRef<string | undefined>(undefined);
  const fileNameRef = useRef<string>('download.pdf');
  const [error, setError] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleError = useCallback(() => {
    alert('해당 문서에 접근할 수 없습니다');
    navigate(-1);
  }, [navigate]);

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileNameRef.current;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchPdf = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/docs/${id}/download`, {
        headers: {
          'X-DEV-USER': '1',
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      });

      // Content-Disposition 헤더에서 파일명 추출
      const contentDisposition = response.headers['Content-Disposition'];
      console.log('Content-Disposition:', contentDisposition);

      let filename = 'download.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        console.log('filenameMatch:', filenameMatch);

        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          console.log('추출된 파일명:', filename);
        }
      }

      // 파일명 디코딩 및 저장
      const decodedFilename = decodeURIComponent(filename);
      console.log('디코딩된 파일명:', decodedFilename);
      fileNameRef.current = decodedFilename;

      // Blob을 URL로 변환
      const blobUrl = URL.createObjectURL(response.data);
      setPdfUrl(blobUrl);
      pdfUrlRef.current = blobUrl;
    } catch (error) {
      console.error(error);
      const err = error as {
        response: { data: errorResponse; status: number };
      };
      if (err.response.status === 403) {
        setError(true);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchPdf();

    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, [fetchPdf]);

  useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error, handleError]);

  return pdfUrl ? (
    <div className="flex flex-1 flex-col space-y-4 pb-10 pt-2">
      <div className="flex justify-center space-x-4">
        <Link to={`/mypage/preview/${id}/files`} className="w-1/2">
          <atoms.ShortButton
            colorType={'primary'}
            className="flex w-full items-center justify-center space-x-2"
          >
            <FolderPlus />
            <span>추가 자료</span>
          </atoms.ShortButton>
        </Link>
        <atoms.ShortButton
          colorType={'black'}
          className="flex w-1/2 items-center justify-center space-x-2"
          onClick={handleDownload}
        >
          <ArrowDownToLine />
          <span>다운로드</span>
        </atoms.ShortButton>
      </div>
      <iframe
        src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
        className="w-full flex-1"
        title="PDF Viewer"
      />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  );
};

export default DocPreview;
