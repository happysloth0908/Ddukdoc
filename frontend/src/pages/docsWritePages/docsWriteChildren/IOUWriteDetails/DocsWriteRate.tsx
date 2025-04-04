import { useNavigate } from 'react-router-dom';
import atoms from '@/components/atoms';
import iouData from '@/types/iou';
import { useState } from 'react';

export const DocsWriteRate = ({
  data,
  handleData,
}: {
  data: iouData;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interest_rate: data.interest_rate.toString() || '',
    repayment_date: data.repayment_date || '',
    interest_payment_date: data.interest_payment_date.toString() || '',
    late_interest_rate: data.late_interest_rate.toString() || '',
    loss_of_benefit_conditions:
      data.loss_of_benefit_conditions.toString() || '',
  });

  const [errorStatus, setErrorStatus] = useState({
    interest_rate: '',
    repayment_date: '',
    interest_payment_date: '',
    late_interest_rate: '',
    loss_of_benefit_conditions: '',
  });

  // 개별 필드 유효성 검사 함수
  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';

    switch (name) {
      case 'interest_rate':
      case 'late_interest_rate':
        if (!/^\d{1,2}(\.\d{1,2})?$/.test(value) || parseFloat(value) > 20) {
          errorMsg = '숫자 최대 20까지, 소수점 둘째 자리까지 입력 가능합니다.';
        }
        break;

      case 'repayment_date':
        if (value === '') {
          errorMsg = '날짜를 선택해주세요.';
        }
        break;

      case 'interest_payment_date': {
        const day = parseInt(value, 10);
        if (isNaN(day) || day < 1 || day > 31) {
          errorMsg = '1일부터 31일 사이 숫자를 입력해주세요.';
        }
        break;
      }

      case 'loss_of_benefit_conditions':
        if (!/^\d+$/.test(value)) {
          errorMsg = '숫자만 입력해주세요.';
        }
        break;
    }

    setErrorStatus((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg !== '';
  };

  // 전체 필드 유효성 검사
  const validateAllFields = () => {
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
    if (!validateAllFields()) {
      return;
    }

    const updatedData = {
      interest_rate: parseFloat(formData.interest_rate),
      repayment_date: formData.repayment_date,
      interest_payment_date: parseInt(formData.interest_payment_date),
      late_interest_rate: parseFloat(formData.late_interest_rate),
      loss_of_benefit_conditions: parseInt(formData.loss_of_benefit_conditions),
    };

    handleData(updatedData);
    navigate('/docs/detail/G1/bank');
  };

  return (
    <div className="flex h-full w-full flex-col">
      <atoms.ProgressBar curStage={3} totalStage={6} />
      <div className="flex flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-6">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={'차용, 원금 정보'}
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-6">
            <div>
              <atoms.Input
                className={
                  errorStatus.interest_rate ? 'ring-1 ring-red-500' : ''
                }
                name="interest_rate"
                defaultValue={formData.interest_rate}
                label="이자율"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.interest_rate ? '' : 'hidden'
                }`}
              >
                {errorStatus.interest_rate}
              </p>
            </div>

            <div>
              <atoms.DateInput
                className={
                  errorStatus.repayment_date ? 'ring-1 ring-red-500' : ''
                }
                name="repayment_date"
                defaultValue={formData.repayment_date}
                label="원금 변제일"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.repayment_date ? '' : 'hidden'
                }`}
              >
                {errorStatus.repayment_date}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.interest_payment_date ? 'ring-1 ring-red-500' : ''
                }
                name="interest_payment_date"
                defaultValue={formData.interest_payment_date}
                label="이자 지급일 (매월)"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.interest_payment_date ? '' : 'hidden'
                }`}
              >
                {errorStatus.interest_payment_date}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.late_interest_rate ? 'ring-1 ring-red-500' : ''
                }
                name="late_interest_rate"
                defaultValue={formData.late_interest_rate}
                label="지연 이자율"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.late_interest_rate ? '' : 'hidden'
                }`}
              >
                {errorStatus.late_interest_rate}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.loss_of_benefit_conditions
                    ? 'ring-1 ring-red-500'
                    : ''
                }
                name="loss_of_benefit_conditions"
                defaultValue={formData.loss_of_benefit_conditions}
                label="기한 이익 상실 연체 횟수"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.loss_of_benefit_conditions ? '' : 'hidden'
                }`}
              >
                {errorStatus.loss_of_benefit_conditions}
              </p>
            </div>
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
