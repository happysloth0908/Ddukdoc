import atoms from "@/components/atoms"
import { Link, useLocation } from "react-router-dom"
import { Documents } from "@/pdfs/Documents";

export const DocsCheck = ({ curTemplate }: { curTemplate: string }) => {
    
  const location = useLocation();
  const previousPage = location.state?.from || "알 수 없음";

  console.log(previousPage);

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col gap-y-6 justify-center">
                <atoms.DocsDescription title="작성하실 문서입니다" subTitle="문서를" description="확인하고 다음을 눌러주세요!" />
                <Documents templateCode={curTemplate} />
            </div>
            <Link to="/docs/role">
                <atoms.LongButton className='mb-20' children="다음" colorType='black' />
            </Link>
        </div>
    )
}