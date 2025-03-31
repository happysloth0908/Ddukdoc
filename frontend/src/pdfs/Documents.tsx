import { useIOUDocsStore } from "@/store/docs";

export const Documents = ({ templateCode }: { templateCode: string }) => {
  const { data } = useIOUDocsStore();

  const formatDate = (dateString: string) => {
      if (!dateString) return { year: '', month: '', day: '' };
      const parts = dateString.split('-');
      return {
          year: parts[0] || '',
          month: parts[1] || '',
          day: parts[2] || ''
      };
  };
  
  const loanDate = formatDate(data.loan_date);
  const repaymentDate = formatDate(data.repayment_date);

  if (templateCode === "G1") {
    return (
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-center mb-8">차 용 증</h1>
    
            <div className="mb-6">
                <table className="w-full border-collapse mb-6">
                    <tbody>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left w-32">차 용 목 적</th>
                            <td className="border border-gray-400 p-2">{data.loan_purpose}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left">차 용 일 자</th>
                            <td className="border border-gray-400 p-2">{loanDate.year}년 {loanDate.month}월 {loanDate.day}일</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left">원 금</th>
                            <td className="border border-gray-400 p-2">{data.principal_amount_text} (₩{data.principal_amount_numeric})</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="mb-6">
                <ol className="list-decimal ml-6">
                <li className="mb-4">
                    차용 내용 및 변제 목적<br />
                    <p className="ml-4">상기 금액을 채무자가 채권자로부터 {loanDate.year}년 {loanDate.month}월 {loanDate.day}일 차용하였으며, 아래와 같이 이행할 것을 확약한다.</p>
                </li>
                </ol>
                
                <table className="w-full border-collapse mb-6">
                    <tbody>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left w-32">이 자 율</th>
                            <td className="border border-gray-400 p-2">{data.interest_rate}%</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left">원 금 변 제 일</th>
                            <td className="border border-gray-400 p-2">{repaymentDate.year}년 {repaymentDate.month}월 {repaymentDate.day}일</td>
                        </tr>
                    </tbody>
                </table>
                
                <ol start={2} className="list-decimal ml-6">
                <li className="mb-4">
                    채무변제방법<br />
                    <p className="ml-4">원금과 이자는 지정 날짜에 채권자의 주소지에 직접 지불하거나 아래의 예금계좌로 송금하여 변제한다.</p>
                </li>
                </ol>
                
                <table className="w-full border-collapse mb-6">
                    <tbody>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left w-32">은행명/예금주</th>
                            <td className="border border-gray-400 p-2">{data.bank_name} / {data.account_holder}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left">예 금 주</th>
                            <td className="border border-gray-400 p-2">{data.account_holder}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-400 bg-gray-100 p-2 text-left">계 좌 번 호</th>
                            <td className="border border-gray-400 p-2">{data.account_number}</td>
                        </tr>
                    </tbody>
                </table>
                
                <ol start={3} className="list-decimal ml-6">
                <li className="mb-4">채무자는 원금 및 이자의 변제를 지체할 경우, 연 {data.late_interest_rate || "_____"}%의 이자율에 의한 지연 손해금을 가산하여 지불하여 한다.</li>
                
                <li className="mb-4">
                    다음 사항 발생 시 채권자(또는 은행)와의 협의 없이 기한의 이익을 상실하며, 채무자는 잔존 채무금 전액을 즉시 변제한다.<br />
                    <p className="ml-4">a. 이자의 지급을 {data.loss_of_benefit_conditions || "_____"}회 이상 연체한 경우<br />
                    b. 채무자가 타 채권자로부터 가압류 또는 압류통지를 받았거나 파산신청을 받은 경우<br />
                    c. 기타 본 계약 사항을 위반한 경우</p>
                </li>
                
                <li className="mb-4">채무자는 본 채무와 관련하여 발생하는 법적 비용, 등록 설정 비용, 주소 이동 등을 부담한다.</li>
                
                <li className="mb-4">본 계약의 관련한 모든 분쟁은 채권자 주소지를 관할하는 법원을 제1심 관할 법원으로 한다.</li>
                </ol>
                
                <div className="mb-6">
                {data.special_terms ? <p className="font-bold">특약사항: <span className="font-normal">{data.special_terms}</span></p> : null}
                </div>
            </div>
            
            <div className="flex justify-between mt-8">
                <div className="w-5/12">
                <h3 className="text-lg font-bold mb-2">채 권 자</h3>
                <p className="mb-1">성 명: {data.creditor_name}</p>
                <p className="mb-1">주 소: {data.creditor_address}</p>
                <p className="mb-1">연락처: {data.creditor_contact}</p>
                <p className="mb-1">주민등록번호: {data.creditor_id}</p>
                <p className="mt-8 mb-1">서명: _________________</p>
                </div>
                
                <div className="w-5/12">
                <h3 className="text-lg font-bold mb-2">채 무 자</h3>
                <p className="mb-1">성 명: {data.debtor_name}</p>
                <p className="mb-1">주 소: {data.debtor_address}</p>
                <p className="mb-1">연락처: {data.debtor_contact}</p>
                <p className="mb-1">주민등록번호: {data.debtor_id}</p>
                <p className="mt-8 mb-1">서명: _________________</p>
                </div>
            </div>
        </div>
    );
} else if (templateCode === "G2") {
    return null;
}
};