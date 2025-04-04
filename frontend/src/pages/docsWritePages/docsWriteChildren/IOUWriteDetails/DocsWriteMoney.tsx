import { useNavigate } from 'react-router-dom';
import atoms from '@/components/atoms';
import iouData from '@/types/iou';
import { useState } from 'react';

// 숫자를 한글 금액으로 변환하는 함수
function numberToKorean(num: number): string {
  if (isNaN(num) || num <= 0) return '';
  const numberStrings = [
    '',
    '일',
    '이',
    '삼',
    '사',
    '오',
    '육',
    '칠',
    '팔',
    '구',
  ];
  const unit = ['', '십', '백', '천'];
  const groupUnit = ['', '만', '억', '조'];
  const digits = String(num).split('').reverse();
  let result = '',
    groupResult = '',
    hasValue = false;

  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);
    const unitPos = i % 4;
    const groupPos = Math.floor(i / 4);

    if (digit !== 0) {
      groupResult = numberStrings[digit] + unit[unitPos] + groupResult;
      hasValue = true;
    }

    if (unitPos === 3 || i === digits.length - 1) {
      if (hasValue) result = groupResult + groupUnit[groupPos] + result;
      groupResult = '';
      hasValue = false;
    }
  }

  return `금 ${result} 원정`;
}

export const DocsWriteMoney = ({
  data,
  handleData,
}: {
  data: iouData;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  const [formData, setFormData] = useState({
    loan_purpose: data.loan_purpose || '',
    loan_date: data.loan_date || '',
    principal_amount_numeric: data.principal_amount_numeric?.toString() || '',
  });

  const [koreanAmount, setKoreanAmount] = useState('');
  const [errorStatus, setErrorStatus] = useState({
    loan_purpose: '',
    loan_date: '',
    principal_amount_numeric: '',
  });

  const navigate = useNavigate();

  // 개별 필드 유효성 검사
  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';

    if (name === 'loan_purpose') {
      if (value.length <= 0 || value.length > 60) {
        errorMsg = '60자 이내로 입력해주세요.';
      }
    }

    if (name === 'loan_date') {
      if (value == '') {
        errorMsg = '날짜를 선택해주세요.';
      }
    }

    if (name === 'principal_amount_numeric') {
      if (!/^\d{1,12}$/.test(value) || value == null) {
        errorMsg = '숫자만 입력 가능하며, 최대 12자리까지입니다.';
        setKoreanAmount('');
      } else {
        const num = parseInt(value, 10);
        if (!isNaN(num)) setKoreanAmount(numberToKorean(num));
      }
    }

    setErrorStatus((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg !== '';
  };

  // 전체 필드 유효성 검사
  const validateAllFields = (): boolean => {
    let hasError = false;
    Object.entries(formData).forEach(([name, value]) => {
      if (checkValidation(name, value)) {
        hasError = true;
      }
    });
    return !hasError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    checkValidation(name, value);
  };

  const handleSenderData = () => {
    if (!validateAllFields()) return;

    const updatedData = {
      loan_purpose: formData.loan_purpose,
      loan_date: formData.loan_date,
      principal_amount_text: koreanAmount,
      principal_amount_numeric: parseInt(formData.principal_amount_numeric),
    };

    handleData(updatedData);
    navigate('/docs/detail/G1/rate');
  };

  return (
    <div className="flex h-full w-full flex-col">
      <atoms.ProgressBar curStage={2} totalStage={6} />
      <div className="flex flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-6">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle="차용, 원금 정보"
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-6">
            <div>
              <atoms.Input
                className={
                  errorStatus.loan_purpose ? 'ring-1 ring-red-500' : ''
                }
                name="loan_purpose"
                defaultValue={formData.loan_purpose}
                label="차용 목적"
                onChange={handleChange}
              />
              {errorStatus.loan_purpose && (
                <p className="text-xs text-red-500">
                  {errorStatus.loan_purpose}
                </p>
              )}
            </div>
            <div>
                <atoms.DateInput
                className={errorStatus.loan_date ? 'ring-1 ring-red-500' : ''}
                name="loan_date"
                defaultValue={formData.loan_date}
                label="차용 일자"
                onChange={handleChange}
                />
                {errorStatus.loan_date && (
                <p className="text-xs text-red-500">
                    {errorStatus.loan_date}
                </p>
                )}
            </div>
            <div>
              <atoms.Input
                className={
                  errorStatus.principal_amount_numeric
                    ? 'ring-1 ring-red-500'
                    : ''
                }
                name="principal_amount_numeric"
                defaultValue={formData.principal_amount_numeric}
                label="원금 (숫자 입력)"
                onChange={handleChange}
              />
              {errorStatus.principal_amount_numeric && (
                <p className="text-xs text-red-500">
                  {errorStatus.principal_amount_numeric}
                </p>
              )}
            </div>
            {koreanAmount && (
              <p className="text-lg font-bold text-gray-700">{koreanAmount}</p>
            )}
          </form>
        </div>
      </div>
      <atoms.LongButton
        onClick={handleSenderData}
        className="mb-20"
        children="다음"
        colorType="black"
      />
    </div>
  );
};
