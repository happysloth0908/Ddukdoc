import atoms from "@/components/atoms"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { contractChoice } from "@/apis/docsWrite"

interface Field {
    field_id: number,        // number - 문서 필드 ID
    role_id: number,        // number - 작성자 역할(0:무관, 1: 채권자 2: 채무자..)
    name: string, // string - 필드 식별 이름
    type: string,    // string - 필드 유형 (checkbox, text, date 등)
    field_label : string // string - 표시 라벨
    is_required: boolean,   // boolean - 필수 입력 여부
    order: number,            // number - 화면 표시 순서
    group: string,  // string - 필드 그룹
    max_length : number, // int 최대 길이
    description : string, // string - 필드 설명
    place_holder: string // string - 예시 값
}

const Form = ({data}: {data: Field[]}) => {
    const renderInputField = (field: Field) => {
        switch (field.type) {
            case "VARCHAR(200)":
        }
    }
}


export const DocsCheck = ({ curTemplate }: { curTemplate: string }) => {
    const [form, setForm] = useState<Field[]>([]);
    useEffect(() => {
        const fetchData = async (code: string) => {
            try {
                const response = await contractChoice(code);
                setForm(response.data);
                console.log(response);
            } catch (error) {
                console.log("비상🚨비상🚨 오류 발생!!", error);
            }
        }
        fetchData(curTemplate);
    }, []);

    return (
        <div className="flex-1 flex flex-col">
        <div className="flex-1">
            {form.length > 0 ? (
                <Form data={form} />
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