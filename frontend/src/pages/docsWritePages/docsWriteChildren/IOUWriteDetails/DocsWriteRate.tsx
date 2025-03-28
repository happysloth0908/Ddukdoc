import { Link } from "react-router-dom";
import atoms from "@/components/atoms";
import iouData from "@/types/iou";
import { useState } from "react";


export const DocsWriteRate = ({data, handleData}: {data: iouData, handleData: (newData: Partial<iouData>) => void}) => {

    const [formData, setFormData] = useState({
        interest_rate: data.interest_rate.toString() || "",
        repayment_date: data.repayment_date || "",
        interest_payment_date: data.interest_payment_date.toString() || "",
        late_interest_rate: data.late_interest_rate.toString() || "",
        loss_of_benefit_conditions: data.loss_of_benefit_conditions.toString() || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value != null) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSenderData = () => {
        console.log("이전 데이터:", data);
        console.log("입력된 데이터:", formData);

        const updatedData = {
            interest_rate: parseInt(formData.interest_rate),
            repayment_date: formData.repayment_date,
            interest_payment_date: parseInt(formData.interest_payment_date),
            late_interest_rate: parseInt(formData.late_interest_rate),
            loss_of_benefit_conditions: parseInt(formData.loss_of_benefit_conditions),
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
                        <atoms.Input name="interest_rate" defaultValue={data.interest_rate.toString() || ""} label="이자율" onChange={handleChange} />
                        <atoms.DateInput name="repayment_date" defaultValue={data.repayment_date || ""} label="원금 변제일" onChange={handleChange} />
                        <atoms.Input name="interest_payment_date" defaultValue={data.interest_payment_date.toString() || ""} label="이자 지급일 (매월)" onChange={handleChange} />
                        <atoms.Input name="late_interest_rate" defaultValue={data.late_interest_rate.toString() || ""} label="지연 이자율" onChange={handleChange} />
                        <atoms.Input name="loss_of_benefit_conditions" defaultValue={data.loss_of_benefit_conditions.toString() || ""} label="기한 이익 상실 연체 횟수" onChange={handleChange} />
                        </form>
                </div>
            </div>
            <Link onClick={handleSenderData} to={"/docs/detail/G1/bank"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};