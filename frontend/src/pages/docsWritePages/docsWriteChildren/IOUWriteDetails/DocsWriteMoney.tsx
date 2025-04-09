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

// 쉼표를 추가하는 함수
const addCommas = (num: string): string => {
  if (!num) return '';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 쉼표와 원화 기호를 제거하는 함수
const removeFormattingChars = (value: string): string => {
  return value.replace(/[₩,\s]/g, '');
};

// 포맷팅 함수: 숫자 앞에 '₩' 추가하고 쉼표 추가
const formatCurrency = (value: string): string => {
  if (!value) return '';
  const numericValue = removeFormattingChars(value);
  if (numericValue === '') return '';
  return `₩ ${addCommas(numericValue)}`;
};

export const DocsWriteMoney = ({
  data,
  handleData,
}: {
  data: iouData;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  // 초기 데이터에 원화 기호와 쉼표 추가
  const initialNumericValue = data.principal_amount_numeric?.toString() || '';
  const formattedInitialValue = initialNumericValue ? formatCurrency(initialNumericValue) : '';

  const [formData, setFormData] = useState({
    loan_purpose: data.loan_purpose || '',
    loan_date: data.loan_date || '',
    principal_amount_numeric: formattedInitialValue,
  });

  const [koreanAmount, setKoreanAmount] = useState(data.principal_amount_text || '');
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
      // 원화 기호와 쉼표 제거
      const numericValue = removeFormattingChars(value);
      if (!/^\d{1,12}$/.test(numericValue) || numericValue == "0") {
        errorMsg = '숫자만 입력 가능하며, 최대 12자리까지입니다.';
        setKoreanAmount('');
      } else {
        const num = parseInt(numericValue, 10);
        if (!isNaN(num)) setKoreanAmount(numberToKorean(num));
      }
    }

    setErrorStatus((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg !== '';
  };

  // 전체 필드 유효성 검사
  const validateAllFields = (): boolean => {
    let hasError = false;
    // loan_purpose, loan_date 검사
    if (checkValidation('loan_purpose', formData.loan_purpose)) {
      hasError = true;
    }
    if (checkValidation('loan_date', formData.loan_date)) {
      hasError = true;
    }
    // principal_amount_numeric 검사 (쉼표와 원화 기호 제거 후)
    const numericValue = removeFormattingChars(formData.principal_amount_numeric);
    if (checkValidation('principal_amount_numeric', numericValue)) {
      hasError = true;
    }
    return !hasError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'principal_amount_numeric') {
      // 숫자만 추출 (원화 기호와 쉼표 제거)
      const numericValue = value.replace(/[^0-9]/g, '');
      
      // 원화 기호와 쉼표 추가한 형식으로 저장
      const formattedValue = formatCurrency(numericValue);
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      
      // 유효성 검사 (쉼표와 원화 기호 없는 값으로)
      checkValidation(name, numericValue);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      checkValidation(name, value);
    }
  };

  const handleSenderData = () => {
    if (!validateAllFields()) return;

    // 쉼표와 원화 기호를 제거하고 숫자만 전송
    const numericValue = removeFormattingChars(formData.principal_amount_numeric);
    
    const updatedData = {
      loan_purpose: formData.loan_purpose,
      loan_date: formData.loan_date,
      principal_amount_text: koreanAmount,
      principal_amount_numeric: parseInt(numericValue, 10),
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
                value={formData.principal_amount_numeric == '₩ 0' ? '' : formData.principal_amount_numeric}  // defaultValue 대신 value 사용
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