import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

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
    
    if (templateCode === "G1") {
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
    else if (templateCode === "G2") {
        return null;
    }
}
