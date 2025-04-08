import { useS1Data } from '@/store/docs';

export const S1 = () => {
  const { data, signature } = useS1Data();

  const formatDate = (dateString: string) => {
    if (!dateString) return { year: '', month: '', day: '' };
    const parts = dateString.split('-');
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || '',
    };
  };

  const exportDate = formatDate(data.export_date);
  const returnDueDate = formatDate(data.return_due_date);

    return (
        <div className="max-h-[55vh] overflow-scroll border border-black p-4 text-xs leading-relaxed text-gray-900">
        <h1 className="mb-6 text-center text-lg font-bold tracking-wide">노트북 반출 확인서</h1>
      
        <div className="mb-4 text-sm flex flex-col gap-y-2">
          <p>본 확인서는 노트북 반출 시 작성하여 접수해야 합니다.</p>
          <p>노트북 반출 이후의 관리 및 분실 책임은 노트북 수령 확인서에 기초하여 사용자의 책임으로 합니다.</p>
        </div>
      
        <ol className="list-decimal pl-4 space-y-2 mb-6 text-xs font-bold">
          <li>분실 또는 도난 당하였을 경우 동일한 성능의 노트북으로 변상한다.</li>
          <li>
            노트북을 파손하였을 경우 전액 수령자 비용 부담으로 수리하여 원 상태로 반납하여야 한다. 실금, 흠집 등 사용상의 문제가 없는 미세 하자 역시 파손에 포함되므로 최초 수령 시점의 외관 상태를 기준으로 한다.
          </li>
          <li>
            노트북을 임의로 타인에게 양도 및 대여할 수 없으며, 이로 인해 발생하는 모든 문제에 대해 수령자의 책임으로 한다.
          </li>
          <li>
            노트북에 임의로 설치한 소프트웨어 및 데이터의 저작권 위반 혹은 라이선스 문제 발생 시 수령자의 책임으로 한다.
          </li>
          <li>노트북은 교육 외(게임, 쇼핑 등) 용도로 사용하지 않는다.</li>
          <li>지급 받은 노트북은 오프라인 출석 시 필수 지참하며, 교육 종료 시 사무국으로 원 상태로(구성품 포함) 반납한다.</li>
          <li>
            허가된 장소(자택, 캠퍼스, 기타 일체의 허가 받은 장소) 외 무단 반출할 경우 절도에 해당하는 민형사상 법적 책임이 있으며, 위 내용 위반 시 즉시 중도 퇴소한다.
          </li>
        </ol>
      
        <p className="mb-6 text-sm text-center">본인은 위 사항에 동의하고 작성한 일자를 준수할 것을 확인합니다.</p>
      
        <ul className="space-y-1 text-sm m-4 list-disc">
          <li>
            반출 일자 : {data.export_date ? `${exportDate.year}년 ${exportDate.month}월 ${exportDate.day}일` : ""}
          </li>
          <li>
            반입 일자 : {data.return_due_date ? `${returnDueDate.year}년 ${returnDueDate.month}월 ${returnDueDate.day}일` : ""}
          </li>
          <li>소속 : {data.location}</li>
          <li>학번 : {data.student_id}</li>
          <li>연락처 : {data.contact_number}</li>
          <li>
            <div className="flex gap-x-10 items-center">
              <p>이름 : {data.applicant_name}</p>
              <div className="relative w-20">
                (인)
                {signature ? (
                  <img
                  className="absolute top-1/2 left-0 w-20 h-20 object-contain -translate-x-1/2 -translate-y-1/2"
                  src={signature}
                    alt="작성자 서명"
                  />
                ) : null}
              </div>
            </div>
          </li>
        </ul>
      
        <p className="text-lg font-semibold text-center">삼성 청년 S/W 아카데미</p>
      </div>      
    );
};
