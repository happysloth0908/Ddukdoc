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
    creditor_name: string;
    creditor_address: string;
    creditor_contact: string;
    creditor_id: string;
    debtor_name: string;
    debtor_address: string;
    debtor_contact: string;
    debtor_id: string;
}