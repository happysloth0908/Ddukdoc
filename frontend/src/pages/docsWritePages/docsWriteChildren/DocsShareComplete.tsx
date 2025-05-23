import atoms from "@/components/atoms";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


export const DocsShareComplete = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const docId = location.state?.docId || "알 수 없음";
    const previousPage = location.state?.from || '알 수 없음';

  // 첫 렌더링 시 접근 가능한 페이지에서 온게 아니라면  다른 곳으로 팅겨내기기
  useEffect(() => {
    switch (previousPage) {
      case '/docs/check':
        break;
      default:
        navigate('/');
        break;
    }
  }, []);

    return (
        <div className="h-full flex flex-col gap-y-6 overflow-hidden">
            <div className="flex flex-1 items-center justify-center">
                <atoms.CompletePage type="save" />
            </div>
            <Link to={"/mypage/detail/" + docId }>
                <atoms.LongButton className='mb-20' children="문서 확인하기" colorType='black' />
            </Link>
        </div>
    );
}