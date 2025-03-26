import { Routes, Route } from 'react-router-dom';
import { DocsWriteSender } from './IOUWriteDetails/DocsWriteSender';
import { DocsWriteMoney } from './IOUWriteDetails/DocsWriteMoney';
import { DocsWriteBank } from './IOUWriteDetails/DocsWriteBank';
import { DocsWriteSpecial } from './IOUWriteDetails/DocsWriteSpecial';
import { useState } from 'react';
import iouData from '@/types/iou';

export const DocsWriteDetail = ({role}: {role: string}) => {
    const [data, handleData] = useState<iouData>({
        loan_purpose: '',
        loan_date: '',
        principal_amount_text: '',
        principal_amount_numeric: 0,
        interest_rate: 0,
        repayment_date: '',
        bank_name: '',
        account_holder: '',
        account_number: '',
        interest_payment_date: 0,
        late_interest_rate: 0,
        loss_of_benefit_conditions: '',
        special_terms: '',
        creditor_name: '',
        creditor_address: '',
        creditor_contact: '',
        creditor_id: '',
        debtor_name: '',
        debtor_address: '',
        debtor_contact: '',
        debtor_id: '',
    })

    return (
        <div className='flex-1 w-full flex justify-center items-center'>
            <Routes>
                <Route path='G1' element={<DocsWriteSender role={role} data={data} handleData={handleData} />}/>
                <Route path='G1/money' element={<DocsWriteMoney data={data} handleData={handleData} />}/>
                <Route path='G1/bank' element={<DocsWriteBank data={data} handleData={handleData} />}/>
                <Route path='G1/special' element={<DocsWriteSpecial data={data} handleData={handleData} />}/>
            </Routes>
        </div>
    );
};