import atoms from "@/components/atoms"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { contractChoice } from "@/apis/docsWrite"
import { Document, Page, Text, View, pdf, StyleSheet, Font } from "@react-pdf/renderer";

// ✅ Interop 폰트 등록 (로컬 폰트 파일 사용)
Font.register({
    family: "Interop",
    src: "/assets/fonts/ttf/Interop-Regular.ttf", // public 폴더 기준 경로
    fontWeight: "normal"
  });
  
Font.register({
    family: "Interop",
    src: "/assets/fonts/ttf/Interop-Bold.ttf",
    fontWeight: "bold"
});
  
  // ✅ 스타일 정의
// const styles = StyleSheet.create({
//     page: { padding: 50 },
//     text: { fontFamily: "Interop", fontSize: 14 },
//     boldText: { fontFamily: "Interop", fontSize: 14, fontWeight: "bold" },
//     title: { fontFamily: "Interop", fontSize: 30, fontWeight: "bold" },
//     container: {
//       display: 'flex',
//       flexDirection: 'row',  // 기본적으로 row 방향으로 정렬
//       justifyContent: 'center',  // 가로 방향으로 가운데 정렬
//       alignItems: 'center',  // 세로 방향으로 가운데 정렬
//       paddingBottom: 20
//     },
//     viewWithMargin: {
//       marginBottom: 20, // 각 View 사이의 간격 (수직 간격)
//     },
// });
const styles = StyleSheet.create({
    page: { 
        padding: 40,
        fontFamily: 'Interop',
        fontSize: 10
    },
    title: { 
        textAlign: 'center', 
        fontSize: 16, 
        fontWeight: 'bold',
        marginBottom: 20
    },
    section: {
        marginBottom: 15
    },
    boldText: {
        fontWeight: 'bold'
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        minWidth: 50,
        marginHorizontal: 3
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    signatureSection: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 10
    }
});


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
                    <atoms.Input />
                    // <input type="text" />
                );
            case "DATE":
                return (
                    <atoms.DateInput />
                    // <input type="date" name="" id="" />
                );
            case "TEXT":
                return (
                    <atoms.Textarea />
                    // <textarea name="" id=""></textarea>
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

// 차용증
const MyDocument = () => {
    // return (
    //     <Document>
    //       <Page size="A4" style={styles.page}>
    //         <View style={styles.container}>
    //             <Text style={styles.title}>차   용   증</Text>
    //         </View>
    //         <View style={styles.viewWithMargin}>
    //             <View style={styles.boldText}>
    //             <Text>차용일자 : 20    년      월      일</Text>
    //             <Text>차용금액 : 금                     원정 (&#8361;                     )</Text>
    //             <Text>차용목적 :</Text>
    //             </View>
    //         </View>
    //         <View style={styles.viewWithMargin}>
    //             <View>
    //                 <Text style={styles.boldText}>1. 상기 금액을 채무자가 채권자로부터 위와 같은 내용으로 차용하였으며, 아래와 같이 이행할 것을 확약한다.</Text>
    //             </View>
    //         </View>
    //       </Page>
    //     </Document>
    // )
    return (
        <Document>
            <Page style={styles.page}>
                {/* Title */}
                <Text style={styles.title}>차 용 증</Text>

                

                {/* Purpose Section */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>차용 목적</Text>
                    <Text style={styles.boldText}>차용 일자 (<Text style={styles.underline}>     </Text>)년 (<Text style={styles.underline}>   </Text>)월 (<Text style={styles.underline}>  </Text>)일</Text>
                    <Text style={styles.boldText}>원금</Text>
                    <Text style={styles.boldText}>
                        금 <Text style={styles.underline}>                   </Text>원정(₩<Text style={styles.underline}>                         </Text>)
                    </Text>
                </View>

                {/* Main Agreement */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>
                        1. 상기 금액을 채무자가 채권자로부터 (<Text style={styles.underline}>     </Text>)년 (<Text style={styles.underline}>  </Text>)월 (<Text style={styles.underline}>  </Text>)일 차용하였으며, 아래와 같이 이행할 것을 확약한다.
                    </Text>
                </View>

                {/* Interest Rate */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>이자율</Text>
                    <Text style={styles.boldText}>(<Text style={styles.underline}>       </Text>) %</Text>
                </View>

                {/* Principal Repayment Date */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>원금 변제일</Text>
                    <Text style={styles.boldText}>(<Text style={styles.underline}>     </Text>)년 (<Text style={styles.underline}>   </Text>)월 (<Text style={styles.underline}>  </Text>)일</Text>
                </View>

                {/* Repayment Method */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>2. 채무변제방법</Text>
                    <Text>원금과 이자는 지정 일자에 채권자의 주소지에 지참 지불하거나 아래의 예금계좌로 송금하여 변제한다.</Text>
                    <View style={styles.row}>
                        <Text style={styles.boldText}>은행</Text>
                        <Text style={styles.underline}>                    </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.boldText}>이자 지급일</Text>
                        <Text>매월 (<Text style={styles.underline}>      </Text>)일</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.boldText}>계좌번호</Text>
                        <Text style={styles.underline}>                    </Text>
                    </View>
                </View>

                {/* Late Payment Clause */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>3. 원금 및 이자의 변제를 지체할 경우 채무자는 일 (<Text style={styles.underline}>    </Text>)%의 이자율에 의한 지연 손실금을 가산해서 지불해야 한다.</Text>
                </View>

                {/* Acceleration Clause */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>4. 다음 경우에는 최고 없이 당연히 기한의 이익을 상실하고 잔존 채무금 전부를 즉시 지급한다.</Text>
                    <Text>A. 이자의 지급을 (<Text style={styles.underline}>    </Text>) 회 이상 지체할 때</Text>
                    <Text>B. 채무자가 타의 채권자로부터 가압류 강제집행을 받거나 파산 화해신청을 받을 때</Text>
                    <Text>C. 기타 이 약정 조항을 위반할 때</Text>
                </View>

                {/* Additional Clauses */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>5. 위 채권을 담보하거나 추심에 필요한 비용은 채무자가 부담한다.</Text>
                    <Text style={styles.boldText}>6. 위 채권에 관한 소는 채권자 주소지에 한다.</Text>
                </View>

                {/* Acknowledgment Statement */}
                <View style={styles.section}>
                    <Text>채무자는 위와 같은 조건으로, 채권자로부터 틀림없이 위 돈을 차용하였으며, 연대보증인은 채무자의 채무이행을 연대보증 하기로 한다.</Text>
                </View>

                {/* Special Provisions */}
                <View style={styles.section}>
                    <Text style={styles.boldText}>특약사항</Text>
                    <Text></Text>
                </View>

                {/* Date */}
                <View style={styles.section}>
                    <Text>20    년     월    일</Text>
                </View>

                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.section}>
                        <Text style={styles.boldText}>채 권 자</Text>
                        <Text>성        명 :                        (인)</Text>
                        <Text>주        소 :</Text>
                        <Text>주민등록번호 :</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.boldText}>채 무 자</Text>
                        <Text>성        명 :                        (인)</Text>
                        <Text>주        소 :</Text>
                        <Text>주민등록번호 :</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

// 근로계약서
// 추가해야함함


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

    // pdf 미리보기
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
    useEffect(() => {
      const generatePdf = async () => {
        const blob = await pdf(<MyDocument />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      };
  
      generatePdf();
    }, []);

    return (
        <div className="flex-1 flex flex-col">
            {/* <div className="flex-1 overflow-scroll">
                {data.length > 0 ? (
                    <Form data={data} />
                ) : (
                    <p>Loading...</p> // 데이터가 로딩되지 않았을 경우 메시지 표시
                )}
            </div> */}
            <div className="flex-1 flex flex-col gap-y-6 justify-center">
                <atoms.DocsDescription title="작성하실 문서입니다" subTitle="문서를" description="확인하고 다음을 눌러주세요!" />
                {pdfUrl ? (
                    <iframe
                    src={pdfUrl+"#toolbar=0&navpanes=0&scrollbar=0"}
                    className="w-full h-[600px]"
                    // sandbox="allow-scripts" // ✅ 인쇄 & 다운로드 차단
                    />
                ) : (
                    <p>PDF 생성 중...</p>
                )}
            </div>
            <Link to="/docs/role">
                <atoms.LongButton className='mb-20' children="다음" colorType='black' />
            </Link>
        </div>
    )
}