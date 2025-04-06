import atoms from '@/components/atoms';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { S1 } from '@/pdfs/SSAFY/S1';
import { contractSave } from '@/apis/ssafy/docsWrite';
import { useS1Data } from '@/store/docs';

export const DocsCheck = ({
  curTemplate,
}: {
  curTemplate: string;
}) => {
  // const { data, creditor_signature, debtor_signature } = useIOUDocsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const previousPage = location.state?.from || '알 수 없음';
  const { data, signature } = useS1Data();

  const getNextPage = () => {
    switch (previousPage) {
      case '/ssafy/docs':
        return `/ssafy/docs/detail/${curTemplate}`;
      case `/ssafy/docs/detail/${curTemplate}/signature`:
        return '/ssafy/docs/share';
      default:
        return '/';
    }
  };

  const formatDateToYYMMDD = (date: Date): string => {
    const year = date.getFullYear().toString().slice(2); // '24'
    const month = String(date.getMonth() + 1).padStart(2, '0'); // '04'
    const day = String(date.getDate()).padStart(2, '0'); // '05'
    return `${year}${month}${day}`; // '240405'
  };

  const today = new Date();
  const formatted = formatDateToYYMMDD(today);

  const save = async () => {
    const formData = {
      "role_id": 6,
      "title": `${formatted}_노트북 반출 확인서_${data.applicant_name}`,
      "data": [
        {
          "field_id": 61,
          "name": "export_date",
          "field_value": data.export_date
        },
        {
          "field_id": 62,
          "name": "return_due_date",
          "field_value": data.return_due_date
        },
        {
          "field_id": 63,
          "name": "location",
          "field_value": data.location
        },
        {
          "field_id": 64,
          "name": "student_id",
          "field_value": data.student_id
        },
        {
          "field_id": 65,
          "name": "contact_number",
          "field_value": data.contact_number
        },
        {
          "field_id": 66,
          "name": "applicant_name",
          "field_value": data.applicant_name
        }
      ]
    }

    const response = await contractSave(curTemplate, formData, signature);
    console.log(response);
    navigate("/ssafy/docs/share");
  }

  
  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <atoms.DocsDescription
          title={
            '작성하' + (previousPage == '/ssafy/docs' ? '실 ' : '신 ') + '문서입니다'
          }
          subTitle="문서를"
          description="확인하고 다음을 눌러주세요!"
        />
        <S1/>
      </div>
      {previousPage == '/ssafy/docs/detail/S1/signature' ? (
        <atoms.LongButton
          onClick={save}
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
