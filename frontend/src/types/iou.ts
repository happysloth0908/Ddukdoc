export default interface iouData {
    loan_purpose: string;
    loan_date: string; // YYYY-MM-DD
    principal_amount_text: string;
    principal_amount_numeric: number;
    interest_rate: number;
    repayment_date: string; // YYYY-MM-DD
    bank_name: string;
    account_holder: string;
    account_number: string;
    interest_payment_date: number;
    late_interest_rate: number;
    loss_of_benefit_conditions: number;
    special_terms?: string; // 선택 항목
    creditor_name: string | null;
    creditor_address: string | null;
    creditor_contact: string | null;
    creditor_id: string | null;
    debtor_name: string | null;
    debtor_address: string | null;
    debtor_contact: string | null;
    debtor_id: string | null;
}