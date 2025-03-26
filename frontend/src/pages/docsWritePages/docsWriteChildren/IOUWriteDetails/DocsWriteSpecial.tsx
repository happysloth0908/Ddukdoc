import { Link } from "react-router-dom";
import atoms from "@/components/atoms";



export const DocsWriteSpecial = () => {

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={4} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"특약 사항"} description="을 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <label>특약 사항(선택)</label>
                        <atoms.Textarea placeholder="추가 내용을 입력하세요" />
                        <atoms.InfoBox context="입력하지 않은 정보 외에 다른 특이사항을 추가하려면<br/>특약 사항을 적는 것이 좋아요:)" />
                    </form>
                </div>
            </div>
            <Link to={"/docs/detail/G1/money"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};