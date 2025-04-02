import atoms from "@/components/atoms";
import { Link, useLocation } from "react-router-dom";


export const DocsShareComplete = () => {
    const location = useLocation();
    const docId = location.state?.docId || "알 수 없음";


    return (
        <div className="h-full flex flex-col gap-y-6 overflow-hidden">
            <div className="flex flex-1 items-center justify-center">
                <atoms.CompletePage type="save" />
            </div>
            <Link to={"/mypage/check/" + docId }>
                <atoms.LongButton className='mb-20' children="문서 목록으로" colorType='black' />
            </Link>
        </div>
    );
}