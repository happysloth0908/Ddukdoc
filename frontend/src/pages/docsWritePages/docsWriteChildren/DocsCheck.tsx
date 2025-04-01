import atoms from "@/components/atoms"
import { Link, useLocation } from "react-router-dom"
import { Documents } from "@/pdfs/Documents";

export const DocsCheck = ({ curTemplate }: { curTemplate: string }) => {
    
  const location = useLocation();
  const previousPage = location.state?.from || "알 수 없음";

  console.log(previousPage);

  const getNextPage = () => {
    switch (previousPage) {
      case "/docs":
        return "/docs/role";
      case "/docs/detail/G1/special":
        return "/docs/detail/G1/signature";
      case "settings":
        return "/settings";
      default:
        return "/";
    }
  };
    return (
        <div className="h-full flex flex-col gap-y-6 overflow-hidden">
            <div className="flex-1 flex overflow-y-scroll">
                <div className="h-full w-full flex flex-col gap-y-2 justify-center">
                    <atoms.DocsDescription title={"작성하" + (previousPage == "/docs" ? "실 " : "신 ") + "문서입니다"} subTitle="문서를" description="확인하고 다음을 눌러주세요!" />
                    <Documents templateCode={curTemplate} />
                </div>
            </div>
            <Link to={getNextPage()}>
                <atoms.LongButton className='mb-20' children="다음" colorType='black' />
            </Link>
        </div>
    )
}