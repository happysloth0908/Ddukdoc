import { ValidateResult } from '@/components/atoms/infos/ValidateResult';
import LongButton from '@/components/atoms/buttons/LongButton';
export const Result = ({
  fileTitle = '',
  result = false,
  onReset,
}: {
  fileTitle?: string;
  result?: boolean;
  onReset: () => void;
}) => {
  return (
    <div className="flex w-full flex-col justify-center">
      <div className="my-10 mt-10 text-info-large font-bold">
        <div>문서 검증 결과를</div>
        <div>알려드릴게요</div>
      </div>
      <div className="felx w-full flex-1 items-center justify-center">
        <ValidateResult fileTitle={fileTitle} status={result} />
      </div>
      <div className="mb-20">
        <LongButton onClick={onReset} colorType="black">
          홈으로
        </LongButton>
      </div>
    </div>
  );
};
