import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { ApiResponse } from '@/types/mypage';
import { ArrowDownToLine, Share } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface errorResponse extends ApiResponse {
  data: null;
}

const SsafyDocsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string>();
  const pdfUrlRef = useRef<string | undefined>(undefined);
  const fileNameRef = useRef<string>('download.pdf');
  const [error, setError] = useState<boolean>(false);

  const fetchDocInfo = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/ssafy/docs/${id}`);
      if (response.data.success) {
        fileNameRef.current = `${response.data.data.docs_info.title}.pdf`;
      }
    } catch (error) {
      console.error('문서 정보 조회 실패:', error);
    }
  }, [id]);

  const handleDownload = useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileNameRef.current;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfUrl]);

  const fetchPdf = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/ssafy/docs/${id}/download`, {
        headers: {
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

  const handleShare = () => {
    navigate(`/ssafy/mypage/share/${id}`);
  };

  useEffect(() => {
    fetchDocInfo();
    fetchPdf();
    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, [id, fetchDocInfo, fetchPdf]);

  return (
    <div className="flex h-full w-full flex-col">
      {error ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">문서에 접근할 수 있는 권한이 없습니다.</p>
        </div>
      ) : pdfUrl ? (
        <div className="flex w-full flex-1 flex-col">
          <iframe
            src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
            className="mb-10 mt-4 w-full flex-1"
            title="PDF Viewer"
          />
          <div className="mb-10 flex flex-col space-y-2">
            <atoms.LongButton
              colorType="primary"
              className="flex items-center justify-center gap-x-2"
              onClick={handleShare}
            >
              <Share />
              MM으로 공유하기
            </atoms.LongButton>
            <atoms.LongButton
              colorType="black"
              className="flex items-center justify-center gap-x-2"
              onClick={handleDownload}
            >
              <ArrowDownToLine />
              문서 다운로드(.pdf)
            </atoms.LongButton>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p>문서를 불러오는 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default SsafyDocsDetail;
