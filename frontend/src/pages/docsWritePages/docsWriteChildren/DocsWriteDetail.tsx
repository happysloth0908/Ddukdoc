import { Routes, Route } from 'react-router-dom';
import { DocsWriteSender } from './IOUWriteDetails/DocsWriteSender';
import { DocsWriteMoney } from './IOUWriteDetails/DocsWriteMoney';
import { DocsWriteRate } from './IOUWriteDetails/DocsWriteRate';
import { DocsWriteBank } from './IOUWriteDetails/DocsWriteBank';
import { DocsWriteSpecial } from './IOUWriteDetails/DocsWriteSpecial';
import { useRef } from 'react';
import iouData from '@/types/iou';

export const DocsWriteDetail = ({role}: {role: string}) => {
    const dataRef = useRef<iouData>({
        loan_purpose: '',               // 차용 목적 2
        loan_date: '',                  // 차용 날짜 2
        principal_amount_text: '',      // 차용 금액 (문자) 2
        principal_amount_numeric: 0,    // 차용 금액 (숫자) 2
        interest_rate: 0,               // 이자율 3
        repayment_date: '',             // 원금 변제일 3
        bank_name: '',                  // 은행명 4
        account_holder: '',             // 예금주 4
        account_number: '',             // 계좌번호 4
        interest_payment_date: 0,       // 이자 지급일 (매월) 3
        late_interest_rate: 0,          // 지연 이자율 3
        loss_of_benefit_conditions: 0, // 연체 횟수 3
        special_terms: '',              // 특약 사함 5
        creditor_name: '',              // 채권자 정보 1
        creditor_address: '',
        creditor_contact: '',
        creditor_id: '',
        debtor_name: '',                // 채무자 정보 1
        debtor_address: '',
        debtor_contact: '',
        debtor_id: '',
    });
    
    const handleData = (newData: Partial<iouData>) => {
        dataRef.current = { ...dataRef.current, ...newData };
        console.log('데이터 업데이트!', dataRef.current);
    };

    return (
        <div className='flex-1 w-full flex justify-center items-center'>
            <Routes>
                <Route path='G1' element={<DocsWriteSender role={role} data={dataRef.current} handleData={handleData} />} />
                <Route path='G1/money' element={<DocsWriteMoney data={dataRef.current} handleData={handleData} />} />
                <Route path='G1/rate' element={<DocsWriteRate data={dataRef.current} handleData={handleData} />} />
                <Route path='G1/bank' element={<DocsWriteBank data={dataRef.current} handleData={handleData} />} />
                <Route path='G1/special' element={<DocsWriteSpecial data={dataRef.current} handleData={handleData} />} />
            </Routes>
        </div>
    );
};