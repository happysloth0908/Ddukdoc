import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
// import { useIOUDocsStore } from "@/store/docs";

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

export const Documents = ({templateCode}: {templateCode: string}) => {
    // const { data } = useIOUDocsStore();
    const data = {
        account_holder
: 
"asdfsd",
account_number
: 
"sdfsdf",
bank_name
: 
"asdf",
creditor_address
: 
"ㅅㄷㄴㅅ",
creditor_contact
: 
"ㅅㄷㄴㅅ",
creditor_id
: 
"test",
creditor_name
: 
"홍석진",
debtor_address
: 
"",
debtor_contact
: 
"",
debtor_id
: 
"",
debtor_name
: 
"",
interest_payment_date
: 
2,
interest_rate
: 
1,
late_interest_rate
: 
3,
loan_date
: 
"2025-03-19",
loan_purpose
: 
"저녁 외식",
loss_of_benefit_conditions
: 
4,
principal_amount_numeric
: 
321651,
principal_amount_text
: 
"금 삼십이만일천육백오십일 원정",
repayment_date
: 
"2025-03-28",
special_terms
: 
"ㅁㄴㅇㅍㅁㄴㅇㅍ"
    }
    
    if (templateCode === "G1") {
        return (
            <Document>
                <Page style={styles.page}>
                    {/* Title */}
                    <Text style={styles.title}>차 용 증</Text>
    
                    {/* Purpose Section */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>차용 목적 : {data.loan_purpose}</Text>
                        <Text style={styles.boldText}>
                            차용 일자 : 
                            {data.loan_date ? (
                                <>
                                    {data.loan_date.split("-")[0]}년 
                                    {data.loan_date.split("-")[1]}월 
                                    {data.loan_date.split("-")[2]}일
                                </>
                            ) : (
                                <>
                                    (<Text style={styles.underline}>     </Text>)년 
                                    (<Text style={styles.underline}>   </Text>)월 
                                    (<Text style={styles.underline}>   </Text>)일
                                </>
                            )}
                        </Text>
                        <Text style={styles.boldText}>원금</Text>
                        <Text style={styles.boldText}>
                            {data.principal_amount_text ? (
                                <Text>{data.principal_amount_text}</Text>
                            ) : (
                                <Text style={styles.underline}>금                   원정</Text>
                            )}
                            (₩
                            {data.principal_amount_numeric ? (
                                <Text>{data.principal_amount_numeric.toLocaleString()}</Text>
                            ) : (
                                <Text style={styles.underline}>                         </Text>
                            )}
                            )
                        </Text>
                    </View>

                    {/* Main Agreement */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>
                            1. 상기 금액을 채무자가 채권자로부터
                            {data.loan_date ? (
                                <>
                                    {data.loan_date.split("-")[0]}년 
                                    {data.loan_date.split("-")[1]}월 
                                    {data.loan_date.split("-")[2]}일
                                </>
                            ) : (
                                <>
                                    (<Text style={styles.underline}>     </Text>)년 
                                    (<Text style={styles.underline}>  </Text>)월 
                                    (<Text style={styles.underline}>  </Text>)일
                                </>
                            )}
                            차용하였으며, 아래와 같이 이행할 것을 확약한다.
                        </Text>
                    </View>

                    {/* Interest Rate */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>이자율</Text>
                        <Text style={styles.boldText}>
                            {data.interest_rate !== undefined ? (
                                <Text>{data.interest_rate}</Text>
                            ) : (
                                <Text style={styles.underline}>(       )</Text>
                            )} %
                        </Text>
                    </View>

                    {/* Principal Repayment Date */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>원금 변제일</Text>
                        <Text style={styles.boldText}>
                            {data.repayment_date ? (
                                <>
                                    {data.repayment_date.split("-")[0]}년 
                                    {data.repayment_date.split("-")[1]}월 
                                    {data.repayment_date.split("-")[2]}일
                                </>
                            ) : (
                                <>
                                    (<Text style={styles.underline}>     </Text>)년 
                                    (<Text style={styles.underline}>   </Text>)월 
                                    (<Text style={styles.underline}>  </Text>)일
                                </>
                            )}
                        </Text>
                    </View>

                    {/* Repayment Method */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>2. 채무변제방법</Text>
                        <Text>원금과 이자는 지정 일자에 채권자의 주소지에 지참 지불하거나 아래의 예금계좌로 송금하여 변제한다.</Text>

                        <View style={styles.row}>
                            <Text style={styles.boldText}>은행 : </Text>
                            <Text>{data.bank_name || <Text style={styles.underline}>                    </Text>}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.boldText}>예금주 : </Text>
                            <Text>{data.account_holder || <Text style={styles.underline}>                    </Text>}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.boldText}>계좌번호 : </Text>
                            <Text>{data.account_number || <Text style={styles.underline}>                    </Text>}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.boldText}>이자 지급일 : </Text>
                            <Text>매월 ({data.interest_payment_date || <Text style={styles.underline}>      </Text>})일</Text>
                        </View>
                    </View>

                    {/* Late Payment Clause */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>
                            3. 채무자는 원금 및 이자의 변제를 지체할 경우, 일
                            {data.late_interest_rate !== undefined ? (
                                <Text>{data.late_interest_rate}</Text>
                            ) : (
                                <Text style={styles.underline}>(    )</Text>
                            )}%의 이자율에 의한 지연 손실금을 가산해서 지불해야 한다.
                        </Text>
                    </View>

                    {/* Acceleration Clause */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>4. 다음 사항 발생 시 최고(사전 통보) 없이 당연히 기한의 이익을 상실하며, 채무자는 잔존 채무금 전액을 즉시 지급한다.</Text>
                        <Text>A. 이자의 지급을 {data.loss_of_benefit_conditions !== undefined ? (
                            <Text>{data.loss_of_benefit_conditions}</Text>
                        ) : (
                            <Text style={styles.underline}>(    )</Text>
                        )} 회 이상 지체할 때</Text>
                        <Text>B. 채무자가 타의 채권자로부터 가압류, 강제집행을 받거나 파산, 화해신청을 받을 때</Text>
                        <Text>C. 기타 본 계약 사항을 위반할 때</Text>
                    </View>

                    {/* Additional Clauses */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>5. 채무자는 본 채권과 관련하여 발생하는 법적 비용, 담보 설정 비용, 추심 비용 등을 부담한다.</Text>
                        <Text style={styles.boldText}>6. 본 계약과 관련한 모든 분쟁은 채권자의 주소지를 관할하는 법원을 제 1심 관할 법원으로 한다.</Text>
                    </View>

                    {/* Special Provisions */}
                    <View style={styles.section}>
                        <Text style={styles.boldText}>특약사항</Text>
                        <Text>{data.special_terms || <Text style={styles.underline}>                    </Text>}</Text>
                    </View>

                    {/* Acknowledgment Statement */}
                    <View style={styles.section}>
                        <Text>본인은 위의 조건에 따라 채권자로부터 차용하였음을 확인하며, 이에 서명합니다.</Text>
                    </View>

                    {/* Date */}
                    <View style={styles.section}>
                        <Text>
                            {data.loan_date ? (
                                <>
                                    {data.loan_date.split("-")[0]}년 
                                    {data.loan_date.split("-")[1]}월 
                                    {data.loan_date.split("-")[2]}일
                                </>
                            ) : (
                                "20    년     월    일"
                            )}
                        </Text>
                    </View>

                    {/* Signature Section */}
                    <View style={styles.signatureSection}>
                        <View style={styles.section}>
                            <Text style={styles.boldText}>채 권 자</Text>
                            <Text>성        명 : {data.creditor_name || "                   "} (인)</Text>
                            <Text>주        소 : {data.creditor_address || "                   "}</Text>
                            <Text>주민등록번호 : {data.creditor_id || "                   "}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.boldText}>채 무 자</Text>
                            <Text>성        명 : {data.debtor_name || "                   "} (인)</Text>
                            <Text>주        소 : {data.debtor_address || "                   "}</Text>
                            <Text>주민등록번호 : {data.debtor_id || "                   "}</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }
    // 근로계약서
    // 추가해야함함
    else if (templateCode === "G2") {
        return null;
    }
}
