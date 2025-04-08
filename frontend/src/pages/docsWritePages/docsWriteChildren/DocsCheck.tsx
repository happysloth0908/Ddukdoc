import atoms from '@/components/atoms';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Documents } from '@/pdfs/Documents';
import { contractSave } from '@/apis/docsWrite';
import { useIOUDocsStore } from '@/store/docs';
import { initializeKakao, shareToKakao } from '@/functions/KakaoShare';

export const DocsCheck = ({
  curTemplate,
  role,
}: {
  curTemplate: string;
  role: string;
}) => {
  const { data, creditor_signature, debtor_signature, resetData } = useIOUDocsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const previousPage = location.state?.from || '알 수 없음';

  console.log(previousPage);
  // 카카오 공유 전 1회 호출 필수
  initializeKakao();

  const getNextPage = () => {
    switch (previousPage) {
      case '/docs':
        return '/docs/role';
      case '/docs/detail/G1/special':
        return '/docs/detail/G1/signature';
      case 'settings':
        return '/settings';
      default:
        return '/';
    }
  };

  const share = async () => {
    // 발신자 문서 저장
    // JSON 데이터 예시
    const jsonData = {
      role_id: role == '채권자' ? 2 : 3,
      title: data.title.toString(),
      data: [
        {
          field_id: 1,
          name: 'loan_purpose',
          field_value: data.loan_purpose.toString(),
        },
        {
          field_id: 2,
          name: 'loan_date',
          field_value: data.loan_date.toString(),
        },
        {
          field_id: 3,
          name: 'principal_amount_text',
          field_value: data.principal_amount_text.toString(),
        },
        {
          field_id: 4,
          name: 'principal_amount_numeric',
          field_value: data.principal_amount_numeric.toString(),
        },
        {
          field_id: 5,
          name: 'interest_rate',
          field_value: data.interest_rate.toString(),
        },
        {
          field_id: 6,
          name: 'repayment_date',
          field_value: data.repayment_date.toString(),
        },
        {
          field_id: 7,
          name: 'bank_name',
          field_value: data.bank_name.toString(),
        },
        {
          field_id: 8,
          name: 'account_holder',
          field_value: data.account_holder.toString(),
        },
        {
          field_id: 9,
          name: 'account_number',
          field_value: data.account_number.toString(),
        },
        {
          field_id: 10,
          name: 'interest_payment_date',
          field_value: data.interest_payment_date.toString(),
        },
        {
          field_id: 11,
          name: 'late_interest_rate',
          field_value: data.late_interest_rate.toString(),
        },
        {
          field_id: 12,
          name: 'loss_of_benefit_conditions',
          field_value: data.loss_of_benefit_conditions.toString(),
        },
        {
          field_id: 13,
          name: 'special_terms',
          field_value: data.special_terms ? data.special_terms.toString() : '',
        },
        {
          field_id: 14,
          name: 'creditor_name',
          field_value: data.creditor_name.toString(),
        },
        {
          field_id: 15,
          name: 'creditor_address',
          field_value: data.creditor_address.toString(),
        },
        {
          field_id: 16,
          name: 'creditor_contact',
          field_value: data.creditor_contact.toString(),
        },
        {
          field_id: 17,
          name: 'creditor_id',
          field_value: data.creditor_id.toString(),
        },
        {
          field_id: 18,
          name: 'debtor_name',
          field_value: data.debtor_name.toString(),
        },
        {
          field_id: 19,
          name: 'debtor_address',
          field_value: data.debtor_address.toString(),
        },
        {
          field_id: 20,
          name: 'debtor_contact',
          field_value: data.debtor_contact.toString(),
        },
        {
          field_id: 21,
          name: 'debtor_id',
          field_value: data.debtor_id.toString(),
        },
      ],
    };

    const signatureURL =
      role == '채권자' ? creditor_signature : debtor_signature;

    try {
      const response = await contractSave('G1', jsonData, signatureURL);
      
      // KAKAO 공유하기
      // ✅ SDK 초기화 확인 후 공유
      if (window.Kakao && window.Kakao.isInitialized()) {
        shareToKakao(
          data.creditor_name || data.debtor_name,
          response.data.pin_code,
          curTemplate == 'G1' ? '차용증' : '근로계약서',
          response.data.document_id,
        );
        resetData();
        navigate('/docs/share', { state: { docId: response.data.document_id } });
      } else {
        console.error('Kakao SDK가 초기화되지 않았습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <atoms.DocsDescription
          title={
            '작성하' + (previousPage == '/docs' ? '실 ' : '신 ') + '문서입니다'
          }
          subTitle="문서를"
          description="확인하고 다음을 눌러주세요!"
        />
        <Documents templateCode={curTemplate} />
      </div>
      {previousPage == '/docs/detail/G1/signature' ? (
        <atoms.LongButton
          onClick={share}
          className="mb-20"
          children="저장 후 공유"
          colorType="black"
        />
      ) : (
        <Link to={getNextPage()}>
          <atoms.LongButton
            className="mb-20"
            children="다음"
            colorType="black"
          />
        </Link>
      )}
    </div>
  );
};
