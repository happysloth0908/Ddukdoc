import { ValidateResult } from '@/components/atoms/infos/ValidateResult';
import LongButton from '@/components/atoms/buttons/LongButton';
export const Result = ({
  fileTitle = '',
  result = false,
  onReset,
  errorType = '',
}: {
  fileTitle?: string;
  result?: boolean;
  onReset: () => void;
  errorType: string;
}) => {
  return (
    <div className="flex h-full w-full flex-col justify-between py-8">
      <div className="text-info-large font-bold">
        <div>문서 검증 결과를</div>
        <div>알려드릴게요</div>
      </div>
      <div className="flex w-full items-center justify-center">
        <ValidateResult
          fileTitle={fileTitle}
          status={result}
          errorType={errorType}
        />
      </div>
      <div>
        <LongButton onClick={onReset} colorType="black">
          홈으로
        </LongButton>
      </div>
    </div>
  );
};
