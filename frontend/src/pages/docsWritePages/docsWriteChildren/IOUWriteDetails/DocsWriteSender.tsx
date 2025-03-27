import { Link } from "react-router-dom";
import atoms from "@/components/atoms";
import iouData from '@/types/iou';
import { useEffect, useState } from "react";

export const DocsWriteSender = ({role, data, handleData}: {role: string, data: iouData, handleData: (newData: Partial<iouData>) => void}) => {
    const [formData, setFormData] = useState({
        name: (data.creditor_name || data.debtor_name) || "",
        id: (data.creditor_id || data.debtor_id) || "",
        address: (data.creditor_address || data.debtor_address) || "",
        contact: (data.creditor_contact || data.debtor_contact) || "",
    });

    // 부모 데이터가 업데이트되면 formData를 동기화 (빈 값일 때만 업데이트)
    // useEffect(() => {
    //     if (!formData.name && !formData.id && !formData.address && !formData.contact) {
    //         setFormData(role === "채권자"
    //             ? {
    //                 name: data.creditor_name || "",
    //                 id: data.creditor_id || "",
    //                 address: data.creditor_address || "",
    //                 contact: data.creditor_contact || "",
    //             }
    //             : {
    //                 name: data.debtor_name || "",
    //                 id: data.debtor_id || "",
    //                 address: data.debtor_address || "",
    //                 contact: data.debtor_contact || "",
    //             }
    //         );
    //     }
    // }, [data, role]);
    useEffect(() => {
        console.log("나는 자식");
        console.log(formData);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value != null) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSenderData = () => {
        console.log("이전 데이터:", data);
        console.log("입력된 데이터:", formData);

        const updatedData = role === "채권자" ? {
            creditor_name: formData.name,
            creditor_id: formData.id,
            creditor_address: formData.address,
            creditor_contact: formData.contact,
        } : {
            debtor_name: formData.name,
            debtor_id: formData.id,
            debtor_address: formData.address,
            debtor_contact: formData.contact,
        };

        handleData(updatedData);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <atoms.ProgressBar curStage={1} totalStage={5} />
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full m-1 flex flex-col gap-y-20">
                    <atoms.DocsDescription title="정보를 입력해주세요" subTitle={role+" 정보"} description="를 입력하고 있어요" />
                    <form className="flex flex-col gap-y-6">
                        <atoms.Input name="name" label="이름" onChange={handleChange} />
                        <atoms.Input name="id" label="주민등록번호" onChange={handleChange} />
                        <atoms.Input name="address" label="주소" onChange={handleChange} />
                        <atoms.Input name="contact" label="연락처" onChange={handleChange} />
                    </form>
                </div>
            </div>
            <Link onClick={handleSenderData} to={"/docs/detail/G1/money"}>
                <atoms.LongButton className="mb-20" children="다음" colorType="black" />
            </Link>
        </div>
    )
};