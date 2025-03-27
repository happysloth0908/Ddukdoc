import { Link } from "react-router-dom";
import atoms from "@/components/atoms";
import { useState } from "react";
import iouData from "@/types/iou";



export const DocsWriteBank = ({data, handleData}: {data: iouData, handleData: (newData: Partial<iouData>) => void}) => {

    const [formData, setFormData] = useState({
        bank_name: "",
        account_holder: "",
        account_number: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSenderData = () => {
        console.log("이전 데이터:", data);
        console.log("입력된 데이터:", formData);

        const updatedData = {
            bank_name: formData.bank_name,
            account_holder: formData.account_holder,
            account_number: formData.account_number,
        }

        handleData(updatedData);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={3} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={"계좌 정보"} description="를 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <atoms.Input name="bank_name" onChange={handleChange} label="은행명" />
                        <atoms.Input name="account_holder" onChange={handleChange} label="예금주" />
                        <atoms.Input name="account_number" onChange={handleChange} label="계좌번호" />
                    </form>
                </div>
            </div>
            <Link onClick={handleSenderData} to={"/docs/detail/G1/special"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};