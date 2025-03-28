import { Link } from "react-router-dom";
import atoms from "@/components/atoms";
import iouData from "@/types/iou";
import { useState } from "react";

// 숫자를 한글 금액으로 변환하는 함수 (일, 십, 백, 천, 만 단위까지 포함)
const numberToKorean = (num: number): string => {
    if (isNaN(num) || num <= 0) return "";

    const unit = ["", "십", "백", "천", "만", "십", "백", "천", "억", "십", "백", "천", "조"];
    const numberStrings = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
    const digits = String(num).split("").reverse();

    let result = "";
    let hasNonZero = false; // 0이 연속되는 경우 처리를 위한 플래그

    for (let i = 0; i < digits.length; i++) {
        const digit = Number(digits[i]);
        if (digit !== 0) {
            result = numberStrings[digit] + unit[i] + result;
            hasNonZero = true;
        } else if (i % 4 === 0 && hasNonZero) {
            result = unit[i] + result;
        }
    }

    return `금 ${result} 원정`;
};

export const DocsWriteMoney = ({data, handleData}: {data: iouData, handleData: (newData: Partial<iouData>) => void}) => {

    const [formData, setFormData] = useState({
        loan_purpose: data.loan_purpose || "",
        loan_date: data.loan_date || "",
        principal_amount_numeric: data.principal_amount_numeric.toString() || "",
    });
    
    const [koreanAmount, setKoreanAmount] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "principal_amount_numeric") {
            const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(num)) {
                setKoreanAmount(numberToKorean(num));
            } else {
                setKoreanAmount("");
            }
        }
        if (value != null) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        
    };
    
    const handleSenderData = () => {
        console.log("이전 데이터:", data);
        console.log("입력된 데이터:", formData);

        const updatedData = {
            loan_purpose: formData.loan_purpose,
            loan_date: formData.loan_date,
            principal_amount_text: koreanAmount,
            principal_amount_numeric: parseInt(formData.principal_amount_numeric),
        }

        handleData(updatedData);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={2} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-6">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"차용, 원금 정보"} description="를 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <atoms.Input name="loan_purpose" defaultValue={data.loan_purpose || ""} label="차용 목적" onChange={handleChange} />
                        <atoms.DateInput name="loan_date" defaultValue={data.loan_date || ""} label="차용 일자" onChange={handleChange} />
                        <atoms.Input name="principal_amount_numeric" defaultValue={data.principal_amount_numeric || ""} label="원금 (숫자 입력)" onChange={handleChange} />
                        {koreanAmount && <p className="text-lg font-bold text-gray-700">{koreanAmount}</p>}
                        </form>
                </div>
            </div>
            <Link onClick={handleSenderData} to={"/docs/detail/G1/rate"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};