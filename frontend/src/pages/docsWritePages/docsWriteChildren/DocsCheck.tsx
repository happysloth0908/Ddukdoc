import atoms from "@/components/atoms"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { contractChoice } from "@/apis/docsWrite"

interface Field {
    field_id: number;
    role_id: number;
    name: string;
    type: string;
    field_label : string;
    is_required: boolean;
    order: number;
    group: string;
    max_length : number | null;
    description : string;
    place_holder: string;
}

const Form = ({data}: {data: Field[]}) => {
    const renderInputField = (field: Field) => {
        switch (field.type) {
            case "VARCHAR(50)":
            case "VARCHAR(100)":
            case "VARCHAR(200)":
            case "VARCHAR(255)":
            case "BIGINT":
            case "INT":
            case "DECIMAL(5,2)":
                return (
                    <input type="text" />
                );
            case "DATE":
                return (
                    // <atoms.DateInput />
                    <input type="date" name="" id="" />
                );
            case "TEXT":
                return (
                    // <atoms.Textarea />
                    <textarea name="" id=""></textarea>
                )
        }
    };

    return (
        <form>
            {data.map((field, i) => (
                <div key={field.field_id}>
                    <label htmlFor={field.name}>{(i+1) + ". " + field.field_label}</label>
                    {renderInputField(field)}
                </div>
            ))}
        </form>
    )
}


export const DocsCheck = ({ curTemplate }: { curTemplate: string }) => {
    // const [form, setForm] = useState<Field[]>([]);
    // useEffect(() => {
    //     const fetchData = async (code: string) => {
    //         try {
    //             const response = await contractChoice(code);
    //             setForm(response.data);
    //             console.log(response);
    //         } catch (error) {
    //             console.log("비상🚨비상🚨 오류 발생!!", error);
    //         }
    //     }
    //     fetchData(curTemplate);
    // }, []);

    const data = [
        {
            "field_id": 1,
            "role_id": 1,
            "name": "loan_purpose",
            "type": "VARCHAR(200)",
            "field_label": "차용 목적",
            "is_required": true,
            "order": 1,
            "group": "기본정보",
            "max_length": 200,
            "description": "차용 목적 입력",
            "place_holder": "예: 사업자금"
        },
        {
            "field_id": 2,
            "role_id": 1,
            "name": "loan_date",
            "type": "DATE",
            "field_label": "차용 일자",
            "is_required": true,
            "order": 2,
            "group": "기본정보",
            "max_length": null,
            "description": "차용한 날짜",
            "place_holder": "YYYY-MM-DD"
        },
        {
            "field_id": 3,
            "role_id": 1,
            "name": "principal_amount_text",
            "type": "VARCHAR(255)",
            "field_label": "원금 (한글)",
            "is_required": true,
            "order": 3,
            "group": "기본정보",
            "max_length": 255,
            "description": "한글로 표기된 원금",
            "place_holder": "예: 금 백만원정"
        },
        {
            "field_id": 4,
            "role_id": 1,
            "name": "principal_amount_numeric",
            "type": "BIGINT",
            "field_label": "원금 (숫자)",
            "is_required": true,
            "order": 4,
            "group": "기본정보",
            "max_length": null,
            "description": "숫자로 표기된 원금",
            "place_holder": "예: 1,000,000"
        },
        {
            "field_id": 5,
            "role_id": 1,
            "name": "interest_rate",
            "type": "DECIMAL(5,2)",
            "field_label": "이자율 (%)",
            "is_required": true,
            "order": 5,
            "group": "변제조건",
            "max_length": null,
            "description": "연이자율",
            "place_holder": "예: 3.5"
        },
        {
            "field_id": 6,
            "role_id": 1,
            "name": "repayment_date",
            "type": "DATE",
            "field_label": "원금 변제일",
            "is_required": true,
            "order": 6,
            "group": "변제조건",
            "max_length": null,
            "description": "변제할 날짜",
            "place_holder": "YYYY-MM-DD"
        },
        {
            "field_id": 7,
            "role_id": 1,
            "name": "bank_name",
            "type": "VARCHAR(100)",
            "field_label": "은행명",
            "is_required": true,
            "order": 7,
            "group": "입금정보",
            "max_length": 100,
            "description": "입금받을 은행",
            "place_holder": "예: 국민은행"
        },
        {
            "field_id": 8,
            "role_id": 1,
            "name": "account_holder",
            "type": "VARCHAR(100)",
            "field_label": "예금주",
            "is_required": true,
            "order": 8,
            "group": "입금정보",
            "max_length": 100,
            "description": "예금주 이름",
            "place_holder": "예: 홍길동"
        },
        {
            "field_id": 9,
            "role_id": 1,
            "name": "account_number",
            "type": "VARCHAR(50)",
            "field_label": "계좌번호",
            "is_required": true,
            "order": 9,
            "group": "입금정보",
            "max_length": 50,
            "description": "입금 계좌번호",
            "place_holder": "예: 123-456-789"
        },
        {
            "field_id": 10,
            "role_id": 1,
            "name": "interest_payment_date",
            "type": "INT",
            "field_label": "이자 지급일 (매월)",
            "is_required": true,
            "order": 10,
            "group": "입금정보",
            "max_length": null,
            "description": "매월 몇 일에 지급하는지",
            "place_holder": "예: 25"
        },
        {
            "field_id": 11,
            "role_id": 1,
            "name": "late_interest_rate",
            "type": "DECIMAL(5,2)",
            "field_label": "지연 이자율 (%)",
            "is_required": true,
            "order": 11,
            "group": "변제조건",
            "max_length": null,
            "description": "연체 발생 시 이자율",
            "place_holder": "예: 5.0"
        },
        {
            "field_id": 12,
            "role_id": 1,
            "name": "loss_of_benefit_conditions",
            "type": "TEXT",
            "field_label": "기한의 이익 상실 조건",
            "is_required": true,
            "order": 12,
            "group": "변제조건",
            "max_length": null,
            "description": "기한의 이익 상실 사유",
            "place_holder": "예: 이자 3회 연체 시"
        },
        {
            "field_id": 13,
            "role_id": 1,
            "name": "special_terms",
            "type": "TEXT",
            "field_label": "특약사항",
            "is_required": false,
            "order": 13,
            "group": "기타",
            "max_length": null,
            "description": "특별 약정 사항",
            "place_holder": "예: 없음"
        },
        {
            "field_id": 14,
            "role_id": 2,
            "name": "creditor_name",
            "type": "VARCHAR(100)",
            "field_label": "채권자 성명",
            "is_required": true,
            "order": 14,
            "group": "채권자 정보",
            "max_length": 100,
            "description": "채권자 이름",
            "place_holder": "예: 김철수"
        },
        {
            "field_id": 15,
            "role_id": 2,
            "name": "creditor_address",
            "type": "VARCHAR(200)",
            "field_label": "채권자 주소",
            "is_required": true,
            "order": 15,
            "group": "채권자 정보",
            "max_length": 200,
            "description": "채권자 주소",
            "place_holder": "예: 서울시 강남구"
        },
        {
            "field_id": 16,
            "role_id": 2,
            "name": "creditor_contact",
            "type": "VARCHAR(50)",
            "field_label": "채권자 연락처",
            "is_required": true,
            "order": 16,
            "group": "채권자 정보",
            "max_length": 50,
            "description": "채권자 전화번호",
            "place_holder": "예: 010-1234-5678"
        },
        {
            "field_id": 17,
            "role_id": 2,
            "name": "creditor_id",
            "type": "VARCHAR(100)",
            "field_label": "채권자 주민등록번호",
            "is_required": true,
            "order": 17,
            "group": "채권자 정보",
            "max_length": 100,
            "description": "주민등록번호",
            "place_holder": "예: 801212-1234567"
        },
        {
            "field_id": 18,
            "role_id": 3,
            "name": "debtor_name",
            "type": "VARCHAR(100)",
            "field_label": "채무자 성명",
            "is_required": true,
            "order": 18,
            "group": "채무자 정보",
            "max_length": 100,
            "description": "채무자 이름",
            "place_holder": "예: 이영희"
        },
        {
            "field_id": 19,
            "role_id": 3,
            "name": "debtor_address",
            "type": "VARCHAR(200)",
            "field_label": "채무자 주소",
            "is_required": true,
            "order": 19,
            "group": "채무자 정보",
            "max_length": 200,
            "description": "채무자 주소",
            "place_holder": "예: 부산시 해운대구"
        },
        {
            "field_id": 20,
            "role_id": 3,
            "name": "debtor_contact",
            "type": "VARCHAR(50)",
            "field_label": "채무자 연락처",
            "is_required": true,
            "order": 20,
            "group": "채무자 정보",
            "max_length": 50,
            "description": "채무자 전화번호",
            "place_holder": "예: 010-9876-5432"
        },
        {
            "field_id": 21,
            "role_id": 3,
            "name": "debtor_id",
            "type": "VARCHAR(100)",
            "field_label": "채무자 주민등록번호",
            "is_required": true,
            "order": 21,
            "group": "채무자 정보",
            "max_length": 100,
            "description": "주민등록번호",
            "place_holder": "예: 901010-2345678"
        }
    ];

    return (
        <div className="flex-1 flex flex-col">
        <div className="flex-1">
            {data.length > 0 ? (
                <Form data={data} />
            ) : (
                <p>Loading...</p> // 데이터가 로딩되지 않았을 경우 메시지 표시
            )}
        </div>
            <Link to="/docs/role">
                <atoms.LongButton className='mb-20' children="다음" colorType='black' />
            </Link>
        </div>
    )
}