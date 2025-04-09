import { create } from 'zustand';
import iouData from '@/types/iou';
import s1Data from '@/types/s1';
import s6Data from '@/types/s6';


// 차용증
interface ioudocsStore {
  data: iouData;
  setData: (newData: Partial<iouData>) => void;
  creditor_signature: string;
  debtor_signature: string;
  resetData: () => void;
  setCreditorSignature: (signature: string) => void;
  setDebtorSignature: (signature: string) => void;
  recipientRoleId: number;
  setRecipientRoleId: (roleId: number) => void;
}

export const useIOUDocsStore = create<ioudocsStore>((set) => {
  const initialData: iouData = {
    title: '',
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
    loss_of_benefit_conditions: 0,
    special_terms: '',
    creditor_name: '',
    creditor_address: '',
    creditor_contact: '',
    creditor_id: '',
    debtor_name: '',
    debtor_address: '',
    debtor_contact: '',
    debtor_id: '',
  };

  return {
    data: initialData,
    setData: (newData) =>
      set((state) => ({
        data: { ...state.data, ...newData },
      })),
    resetData: () =>
      set(() => ({
        data: initialData,
        creditor_signature: '',
        debtor_signature: '',
        recipientRoleId: -1,
      })),
    creditor_signature: '',
    debtor_signature: '',
    setCreditorSignature: (creditor_signature) => set({ creditor_signature }),
    setDebtorSignature: (debtor_signature) => set({ debtor_signature }),
    recipientRoleId: -1,
    setRecipientRoleId: (recipientRoleId) => set({ recipientRoleId }),
  };
});


// 노트북 반출 확인서
interface s1 {
  data: s1Data;
  setData: (newData: Partial<s1Data>) => void;
  signature: string;
  setSignature: (signature: string) => void;
  resetData: () => void;
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
  resetData: () => 
    set(() => ({
      data: {
        export_date: '',
        return_due_date: '',
        location: '',
        student_id: '',
        contact_number: '',
        applicant_name: '',
      },
      signature: '',
    })),
}))


interface s6 {
  data: s6Data;
  setData: (newData: Partial<s6Data>) => void;
  signature: string;
  setSignature: (signature: string) => void;
  resetData: () => void;
}

export const useS6Data = create<s6>((set) => ({
  data: {
    date: '',
    project_name: '',
    birth: '',
    name: '',
  },
  setData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  signature: '',
  setSignature: (signature) => set({ signature }),
  resetData: () => 
    set(() => ({
      data: {
        date: '',
        project_name: '',
        birth: '',
        name: '',
      },
      signature: '',
    })),
}))