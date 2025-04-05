import { useNavigate } from 'react-router-dom';
import atoms from '@/components/atoms';
import { useState } from 'react';
import iouData from '@/types/iou';

export const DocsWriteBank = ({
  data,
  handleData,
}: {
  data: iouData;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bank_name: data.bank_name || '',
    account_holder: data.account_holder || '',
    account_number: data.account_number || '',
  });

  const [errorStatus, setErrorStatus] = useState({
    bank_name: '',
    account_holder: '',
    account_number: '',
  });

  // 개별 필드 유효성 검사
  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';

    if (name === 'bank_name' || name === 'account_holder') {
      if (!value.trim()) {
        errorMsg = '필수 입력 항목입니다.';
      }
    }

    if (name === 'account_number') {
      if (!value.trim()) {
        errorMsg = '필수 입력 항목입니다.';
      } else if (!/^\d*$/.test(value)) {
        errorMsg = '계좌번호는 숫자만 입력해주세요.';
      } else if (value.length > 16) {
        errorMsg = '16자리 이하로 작성해주세요.';
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
      bank_name: formData.bank_name,
      account_holder: formData.account_holder,
      account_number: formData.account_number,
    };

    handleData(updatedData);
    navigate('/docs/detail/G1/special');
  };

  return (
    <div className="flex h-full w-full flex-col">
      <atoms.ProgressBar curStage={4} totalStage={6} />
      <div className="flex flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-20">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle="계좌 정보"
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-6">
            <div>
              <atoms.Input
                name="bank_name"
                defaultValue={formData.bank_name}
                onChange={handleChange}
                label="은행명"
                className={errorStatus.bank_name ? 'ring-1 ring-red-500' : ''}
              />
              {errorStatus.bank_name && (
                <p className="text-xs text-red-500">{errorStatus.bank_name}</p>
              )}
            </div>

            <div>
              <atoms.Input
                name="account_holder"
                defaultValue={formData.account_holder}
                onChange={handleChange}
                label="예금주"
                className={
                  errorStatus.account_holder ? 'ring-1 ring-red-500' : ''
                }
              />
              {errorStatus.account_holder && (
                <p className="text-xs text-red-500">
                  {errorStatus.account_holder}
                </p>
              )}
            </div>

            <div>
              <atoms.Input
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                label="계좌번호"
                className={
                  errorStatus.account_number ? 'ring-1 ring-red-500' : ''
                }
              />
              {errorStatus.account_number && (
                <p className="text-xs text-red-500">
                  {errorStatus.account_number}
                </p>
              )}
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
