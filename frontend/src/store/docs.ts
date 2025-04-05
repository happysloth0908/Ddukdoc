import { create } from 'zustand';
import iouData from '@/types/iou';
import s1Data from '@/types/s1';


// 차용증
interface ioudocsStore {
  data: iouData;
  setData: (newData: Partial<iouData>) => void;
  creditor_signature: string;
  debtor_signature: string;
  setCreditorSignature: (signature: string) => void;
  setDebtorSignature: (signature: string) => void;
  recipientRoleId: number;
  setRecipientRoleId: (roleId: number) => void;
}

export const useIOUDocsStore = create<ioudocsStore>((set) => ({
  data: {
    title: '',
    loan_purpose: '', // 차용 목적 2
    loan_date: '', // 차용 날짜 2
    principal_amount_text: '', // 차용 금액 (문자) 2
    principal_amount_numeric: 0, // 차용 금액 (숫자) 2
    interest_rate: 0, // 이자율 3
    repayment_date: '', // 원금 변제일 3
    bank_name: '', // 은행명 4
    account_holder: '', // 예금주 4
    account_number: '', // 계좌번호 4
    interest_payment_date: 0, // 이자 지급일 (매월) 3
    late_interest_rate: 0, // 지연 이자율 3
    loss_of_benefit_conditions: 0, // 연체 횟수 3
    special_terms: '', // 특약 사함 5
    creditor_name: '', // 채권자 정보 1
    creditor_address: '',
    creditor_contact: '',
    creditor_id: '',
    debtor_name: '', // 채무자 정보 1
    debtor_address: '',
    debtor_contact: '',
    debtor_id: '',
  },
  setData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  creditor_signature: '',
  debtor_signature: '',
  setCreditorSignature: (creditor_signature) => set({ creditor_signature }),
  setDebtorSignature: (debtor_signature) => set({ debtor_signature }),
  recipientRoleId: -1,
  setRecipientRoleId: (recipientRoleId) => set({ recipientRoleId }),
}));


// 노트북 반출 확인서
interface s1 {
  data: s1Data;
  setData: (newData: Partial<s1Data>) => void;
  signature: string;
  setSignature: (signature: string) => void;
}

export const useS1Data = create<s1>((set) => ({
  data: {
    export_date: '',
    return_due_date: '',
    location: '',
    student_id: '',
    contact_number: '',
    applicant_name: '',
  },
  setData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  signature: '',
  setSignature: (signature) => set({ signature }),
}))