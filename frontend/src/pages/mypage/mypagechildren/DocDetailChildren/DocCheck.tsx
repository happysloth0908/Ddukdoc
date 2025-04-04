import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomRollup from '@/components/atoms/inputs/BottomRollup.tsx';
import Refuse from '@/pages/mypage/mypagechildren/Refuse.tsx';
import { apiClient } from '@/apis/mypage.ts';
import { DocData, ApiResponse } from '@/types/mypage.ts';
import { Documents } from '@/pdfs/Documents';
import { useIOUDocsStore } from '@/store/docs';
import { usePinStore } from '@/store/mypage';

interface apiResponse extends ApiResponse {
  data: data;
}

interface errorResponse extends ApiResponse {
  data: errorData;
}

interface errorData {
  creatorName: string;
  documentId: number;
  documentTitle: string;
  userId: number;
}

interface data {
  docs_info: DocData;
  field: Field[];
  signature: {
    creator_signature: string;
    recipient_signature: string;
  };
  user_role_info: {
    creator_role_id: number;
    recipient_role_id: number;
  };
}

interface Field {
  field_id: number;
  role_id: number;
  field_name: string;
  is_required: boolean;
  type: string;
  order: number;
  group: string;
  field_value: string;
}

const DocCheck = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [docData, setDocData] = useState<DocData>();
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const {
    setData,
    setCreditorSignature,
    setDebtorSignature,
    setRecipientRoleId,
  } = useIOUDocsStore();
  const { setPinInfo } = usePinStore();

  const fetchDoc = useCallback(async () => {
    try {
      const response = await apiClient.get<apiResponse>(`/api/docs/${id}`);

      console.log(response.data.data);

      setDocData(response.data.data.docs_info);

      // field 배열에서 필요한 정보 추출
      const fields = response.data.data.field;
      const fieldMap = fields.reduce(
        (acc, field) => {
          acc[field.field_name] = field.field_value;
          return acc;
        },
        {} as Record<string, string>
      );

      // 전역 상태 업데이트
      setData({
        // field에서 가져오는 정보들
        loan_purpose: fieldMap['loan_purpose'] || '',
        loan_date: fieldMap['loan_data'] || '',
        principal_amount_text: fieldMap['principal_amount_text'] || '',
        principal_amount_numeric:
          Number(fieldMap['principal_amount_numeric']) || 0,
        interest_rate: Number(fieldMap['interest_rate']) || 0,
        repayment_date: fieldMap['repayment_date'] || '',
        bank_name: fieldMap['bank_name'] || '',
        account_holder: fieldMap['account_holder'] || '',
        account_number: fieldMap['account_number'] || '',
        interest_payment_date: Number(fieldMap['interest_payment_date']) || 0,
        late_interest_rate: Number(fieldMap['late_interest_rate']) || 0,
        loss_of_benefit_conditions:
          Number(fieldMap['loss_of_benefit_conditions']) || 0,
        special_terms: fieldMap['special_terms'] || '',
        creditor_name: fieldMap['creditor_name'] || '',
        creditor_address: fieldMap['creditor_address'] || '',
        creditor_contact: fieldMap['creditor_contact'] || '',
        creditor_id: fieldMap['creditor_id'] || '',
        debtor_name: fieldMap['debtor_name'] || '',
        debtor_address: fieldMap['debtor_address'] || '',
        debtor_contact: fieldMap['debtor_contact'] || '',
        debtor_id: fieldMap['debtor_id'] || '',
      });

      // 서명 정보 업데이트
      setCreditorSignature(
        'data:image/png;base64,' +
          response.data.data.signature.creator_signature
      );
      setDebtorSignature(
        'data:image/png;base64,' +
          response.data.data.signature.recipient_signature
      );
      setRecipientRoleId(response.data.data.user_role_info.recipient_role_id);
    } catch (error) {
      console.error(error);
      const err = error as { response: { data: errorResponse } };
      if (err.response.data.error.code === 'C005') {
        alert('해당 문서에 접근할 수 없습니다');
        navigate('/mypage');
      } else if (err.response.data.error.code === 'P002') {
        setPinInfo({
          creatorName: err.response.data.data.creatorName,
          documentTitle: err.response.data.data.documentTitle,
        });
        navigate(`/mypage/pin/${id}`);
      }
    }
  }, [
    id,
    setData,
    setCreditorSignature,
    setDebtorSignature,
    setRecipientRoleId,
    setPinInfo,
    navigate,
  ]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  const test = () => {
    if (isChecked) {
      navigate(`/mypage/detail/${id}/input`);
    }
  };
  return (
    <div
      className={
        'flex h-full w-full flex-col items-center overflow-hidden py-10'
      }
    >
      {/* 문서정보 PDF가 들어갈 부분 */}
      <Documents templateCode={docData?.template_code || 'G1'} />

      {/* 체크박스 영역 */}
      <div className="mt-16 flex items-center space-x-2">
        <input
          type="checkbox"
          id="confirm-doc"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="confirm-doc" className="text-sm text-gray-700">
          문서 내용을 확인했습니다
        </label>
      </div>

      <div className={'mt-4 w-full'}>
        <LongButton
          children={'정보입력'}
          colorType={isChecked ? 'black' : 'gray'}
          onClick={test}
          className={!isChecked ? 'cursor-not-allowed' : ''}
        />
        <div
          onClick={() => setIsOpen(true)}
          className="mt-3 cursor-pointer justify-center text-center text-md font-medium text-status-warning underline"
        >
          문서 내용이 잘못되었나요? 반송하기
        </div>
      </div>

      <BottomRollup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Refuse />
      </BottomRollup>
    </div>
  );
};

export default DocCheck;
