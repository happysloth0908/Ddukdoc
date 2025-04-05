import atoms from '@/components/atoms';
import iouData from '@/types/iou';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InfoInput = ({
  role,
  handleData,
}: {
  role: number;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    address: '',
    contact: '',
  });

  const [errorStatus, setErrorStatus] = useState({
    name: '',
    id: '',
    address: '',
    contact: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // 연락처 하이픈 자동 삽입
  const formatPhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 7)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  // 주민등록번호 하이픈 자동 삽입
  const formatIdNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    if (numbersOnly.length <= 6) return numbersOnly;
    return `${numbersOnly.slice(0, 6)}-${numbersOnly.slice(6, 13)}`;
  };

  const checkValidation = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[가-힣a-zA-Z]{2,20}$/.test(value.trim()))
          error = '이름은 특수문자, 숫자 제외 작성해주세요.';
        break;
      case 'address':
        if (value.length >= 60) error = '주소는 60자 미만으로 작성해주세요.';
        break;
      case 'id':
        if (!/^\d{6}-\d{7}$/.test(value))
          error = '주민번호는 13자리 숫자로만 작성해주세요.';
        break;
      case 'contact':
        if (value.length != 13) error = '전화번호 11자리를 입력해주세요.';
        else if (!/^\d{3}-\d{4}-\d{4}$/.test(formatPhoneNumber(value)))
          error = '연락처는 (-)제외 숫자로만 작성해주세요';
        break;
      default:
        break;
    }
    setErrorStatus((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'contact') {
      newValue = formatPhoneNumber(value);
    } else if (name === 'id') {
      newValue = formatIdNumber(value);
    }
    checkValidation(name, newValue);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateAllFields = () => {
    let valid = true;
    Object.keys(formData).forEach((field) => {
      const value =
        field === 'contact'
          ? formatPhoneNumber(formData[field as keyof typeof formData])
          : formData[field as keyof typeof formData];
      if (checkValidation(field, value)) valid = false;
    });
    return valid;
  };

  const handleSenderData = async () => {
    if (!validateAllFields()) {
      return;
    }

    const updatedData =
      role === 2
        ? {
            creditor_name: formData.name,
            creditor_id: formData.id,
            creditor_address: formData.address,
            creditor_contact: formData.contact,
          }
        : {
            debtor_name: formData.name,
            debtor_id: formData.id,
            debtor_address: formData.address,
            debtor_contact: formData.contact,
          };

    handleData(updatedData);
    navigate(`/mypage/detail/${id}/signature`);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <atoms.ProgressBar curStage={1} totalStage={3} />
      <div className="flex flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-20">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={role === 2 ? '채권자' : '채무자' + ' 정보'}
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-6">
            <div>
              <atoms.Input
                className={errorStatus.name ? 'ring-1 ring-red-500' : ''}
                name="name"
                label="이름"
                onChange={handleChange}
              />
              <p
                className={
                  'text-xs text-red-500 ' + (errorStatus.name ? '' : 'hidden')
                }
              >
                {errorStatus.name}
              </p>
            </div>
            <div>
              <atoms.Input
                className={errorStatus.id ? 'ring-1 ring-red-500' : ''}
                name="id"
                label="주민등록번호"
                onChange={handleChange}
              />
              <p
                className={
                  'text-xs text-red-500 ' + (errorStatus.id ? '' : 'hidden')
                }
              >
                {errorStatus.id}
              </p>
            </div>
            <div>
              <atoms.Input
                className={errorStatus.address ? 'ring-1 ring-red-500' : ''}
                name="address"
                label="주소"
                onChange={handleChange}
              />
              <p
                className={
                  'text-xs text-red-500 ' +
                  (errorStatus.address ? '' : 'hidden')
                }
              >
                {errorStatus.address}
              </p>
            </div>
            <div>
              <atoms.Input
                className={errorStatus.contact ? 'ring-1 ring-red-500' : ''}
                name="contact"
                label="연락처"
                onChange={handleChange}
              />
              <p
                className={
                  'text-xs text-red-500 ' +
                  (errorStatus.contact ? '' : 'hidden')
                }
              >
                {errorStatus.contact}
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

export default InfoInput;
