import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { ApiResponse } from '@/types/mypage';
import { ArrowDownToLine, Share, Edit } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

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
  const [templateCode, setTemplateCode] = useState<string>('');

  const fetchDocInfo = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/ssafy/docs/${id}`);
      if (response.data.success) {
        fileNameRef.current = `${response.data.data.docs_info.title}.pdf`;
        setTemplateCode(response.data.data.docs_info.template_code);
      }
    } catch (error) {
      console.error('문서 정보 조회 실패:', error);
    }
  }, [id]);

  // const handleDownload = useCallback(() => {
  //   if (pdfUrl) {
  //     const link = document.createElement('a');
  //     link.href = pdfUrl;
  //     link.download = fileNameRef.current;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }, [pdfUrl]);

  const isAndroidWebView = /Android/i.test(navigator.userAgent) && /wv/.test(navigator.userAgent);

  const handleDownload = useCallback(async () => {
    if (isAndroidWebView) {
      const response = await apiClient.get(`/api/ssafy/docs/${id}/download`, {
        headers: {
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      });
  
      const blob = response.data;
      const reader = new FileReader();
  
      reader.onloadend = function () {
        const base64data = reader.result;
        if (typeof base64data === 'string' && window.AndroidBridge && window.AndroidBridge.saveFile) {
          window.AndroidBridge.saveFile(base64data, fileNameRef.current);
        }
      };
  
      reader.readAsDataURL(blob);
    } else {
      // 기존 웹 다운로드 로직 유지
      const link = document.createElement('a');
      if (pdfUrl) link.href = pdfUrl;
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

  const handleEdit = () => {
    navigate(`/ssafy/mypage/patch/${id}`, {
      state: { templateCode },
    });
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
          <div className="relative flex flex-1 flex-col">
            <button
              onClick={handleEdit}
              className="absolute right-2 top-6 z-10 rounded-full bg-black p-2 shadow-md hover:bg-gray-100"
            >
              <Edit className="h-5 w-5 text-white" />
            </button>
            {/* <iframe
              src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
              className="mb-10 mt-4 w-full flex-1"
              title="PDF Viewer"
            /> */}
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <div className="w-full h-full max-h-[500px] mx-auto border rounded-lg shadow overflow-hidden bg-white">
                <Viewer fileUrl={pdfUrl}/>
              </div>
            </Worker>
          </div>
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
