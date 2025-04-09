import atoms from '@/components/atoms';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { S1 } from '@/pdfs/SSAFY/S1';
import { S6 } from '@/pdfs/SSAFY/S6';
import { contractSave } from '@/apis/ssafy/docsWrite';
import { useS1Data, useS6Data } from '@/store/docs';
import blockchainLoading from '@/assets/images/blockchain/blockchain.gif';
import { useEffect, useState } from 'react';

export const DocsCheck = ({
  curTemplate,
}: {
  curTemplate: string;
}) => {
  // const { data, creditor_signature, debtor_signature } = useIOUDocsStore();
  const location = useLocation();
  const navigate = useNavigate();
  const previousPage = location.state?.from || '알 수 없음';
  console.log(previousPage.split('/').at(-1));
  const S1Data = useS1Data();
  const S6Data = useS6Data();
  const [isLoading, setIsLoading] = useState(false);
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setDots((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 700);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

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
    setIsLoading(true);
      if (curTemplate == "S1") {
        const formData = {
          "role_id": 6,
          "title": `${formatted}_노트북 반출 확인서_${S1Data.data.applicant_name}`,
          "data": [
            {
              "field_id": 61,
              "name": "export_date",
              "field_value": S1Data.data.export_date
            },
            {
              "field_id": 62,
              "name": "return_due_date",
              "field_value": S1Data.data.return_due_date
            },
            {
              "field_id": 63,
              "name": "location",
              "field_value": S1Data.data.location
            },
            {
              "field_id": 64,
              "name": "student_id",
              "field_value": S1Data.data.student_id
            },
            {
              "field_id": 65,
              "name": "contact_number",
              "field_value": S1Data.data.contact_number
            },
            {
              "field_id": 66,
              "name": "applicant_name",
              "field_value": S1Data.data.applicant_name
            }
          ]
        }
        try {
          await contractSave(curTemplate, formData, S1Data.signature).then((res) => {
            setIsLoading(false);
            S1Data.resetData();
            navigate("/ssafy/docs/share", {state: { docId: res.data}});
          });
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
      else if (curTemplate == "S6") {
        const formData = {
          "role_id": 6,
          "title": `${formatted}_프로젝트 활용 동의서_${S6Data.data.name}`,
          "data": [
              {
                  "field_id": 88,
                  "name": "project_name", 
                  "field_value": S6Data.data.project_name
              },
              {
                  "field_id": 89,
                  "name": "submitted_date", 
                  "field_value": S6Data.data.date
              },
              {
                  "field_id": 90,
                  "name": "student_birthdate", 
                  "field_value": S6Data.data.birth
              },
              {
                  "field_id": 91,
                  "name": "student_name", 
                  "field_value": S6Data.data.name
              }
          ]
        }
        try {
          await contractSave(curTemplate, formData, S6Data.signature).then((res) => {
            setIsLoading(false);
            S6Data.resetData();
            navigate("/ssafy/docs/share", {state: { docId: res.data}});
          });
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
    }

  const docType = (curTemplate: string) => {
    switch (curTemplate) {
      case "S1":
        return <S1/>;
      case "S6":
        return <S6/>;
    }
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
        {/* 일단 노트북 반출 서류만 */}
        {docType(curTemplate)}
      </div>
      {previousPage.split('/').at(-1) == 'signature' ? (
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
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center justify-center rounded-lg p-8">
            <img
              src={blockchainLoading}
              alt="blockchain"
              className="h-40 w-40"
            />
            <p className="mt-4 text-lg font-medium text-white">
              블록체인에 저장중{'.'.repeat(dots)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
