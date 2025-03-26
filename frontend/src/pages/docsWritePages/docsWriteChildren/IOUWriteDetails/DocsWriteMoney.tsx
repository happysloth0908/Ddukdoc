import { Link } from "react-router-dom";
import atoms from "@/components/atoms";



export const DocsWriteMoney = () => {

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={2} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"차용, 원금 정보"} description="를 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <atoms.Input label="차용 목적" />
                        <atoms.DateInput label="차용 일자" />
                        <atoms.Input label="원금 (한글 입력)" />
                        <atoms.Input label="원금 (숫자 입력)" />
                    </form>
                </div>
            </div>
            <Link to={"/docs/detail/G1/bank"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};