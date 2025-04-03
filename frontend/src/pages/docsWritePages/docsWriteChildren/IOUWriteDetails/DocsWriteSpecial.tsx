import { Link, useLocation } from "react-router-dom";
import atoms from "@/components/atoms";
import iouData from "@/types/iou";
import { useState } from "react";



export const DocsWriteSpecial = ({data, handleData}: {data: iouData, handleData: (newData: Partial<iouData>) => void}) => {

    const location = useLocation();
    const currentPath = location.pathname;
    
    const [formData, setFormData] = useState({
        special_terms: data.special_terms || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (value != null) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSenderData = () => {
        console.log("이전 데이터:", data);
        console.log("입력된 데이터:", formData);

        const updatedData = {
            special_terms: formData.special_terms,
        }

        handleData(updatedData);
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={5} totalStage={6} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"특약 사항"} description="을 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <label>특약 사항(선택)</label>
                        <atoms.Textarea name="special_terms" onChange={handleChange} defaultValue={data.special_terms || ""} placeholder="추가 내용을 입력하세요" />
                        <atoms.InfoBox context="입력하지 않은 정보 외에 다른 특이사항을 추가하려면<br/>특약 사항을 적는 것이 좋아요:)" />
                    </form>
                </div>
            </div>
            <Link onClick={handleSenderData} to={"/docs/check"} state={{ from: currentPath }}>
                <atoms.LongButton onClick={handleSenderData} className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};