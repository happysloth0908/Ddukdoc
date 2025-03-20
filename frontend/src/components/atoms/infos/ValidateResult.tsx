import Forgery from '@/assets/images/forgeryInspection';

interface ValidateResultProps {
  status: boolean;
  fileTitle: string;
}

export const ValidateResult = ({ status, fileTitle }: ValidateResultProps) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('ko-KR').replace(/-/g, '.');

  // 검증 성공
  if (status) {
    return (
      <div className="flex w-72 flex-col items-center justify-center gap-y-8 rounded-3xl border p-6 text-xs shadow-md">
        <div className="w-full">
          <p className="text-info-small font-bold">{fileTitle}</p>
          <p>해당 문서는 위변조 되지 않았음을 보장합니다.</p>
        </div>
        <img className="w-2/3" src={Forgery.SecurityShield} alt="success" />
        <div className="flex w-full flex-col justify-end text-right">
          <p className="font-bold">검증일</p>
          <p>{formattedDate}</p>
        </div>
      </div>
    );
  }
  // 검증 실패
  else {
    return (
      <div className="flex w-72 flex-col items-center justify-center gap-y-8 rounded-3xl border p-6 text-xs shadow-md">
        <div className="w-full">
          <p className="text-info-small font-bold">{fileTitle}</p>
          <p>해당 문서는 위조된 문서입니다.</p>
        </div>
        <img className="w-2/3" src={Forgery.WarningSign} alt="success" />
        <div className="flex w-full flex-col justify-end text-right">
          <p className="font-bold">검증일</p>
          <p>{formattedDate}</p>
        </div>
      </div>
    );
  }
};
