import { Link } from "react-router-dom";
import atoms from "@/components/atoms";



export const DocsWriteBank = () => {

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={3} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"계좌 정보"} description="를 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <atoms.Input label="은행명" />
                        <atoms.Input label="예금주" />
                        <atoms.Input label="계좌번호" />
                        <atoms.Input label="이자 지급일 (매월)" />
                    </form>
                </div>
            </div>
            <Link to={"/docs/detail/G1/special"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};