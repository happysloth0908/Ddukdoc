import { useNavigate } from 'react-router-dom';
import atoms from '@/components/atoms';
import iouData from '@/types/iou';
import { useState } from 'react';

export const DocsWriteSender = ({
  role,
  data,
  handleData,
}: {
  role: string;
  data: iouData;
  handleData: (newData: Partial<iouData>) => void;
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: data.title || '',
    name: data.creditor_name || data.debtor_name || '',
    id: data.creditor_id || data.debtor_id || '',
    address: data.creditor_address || data.debtor_address || '',
    contact: 
    (data.creditor_contact ? data.creditor_contact.replace(/-/g, '') : '') ||
    (data.debtor_contact ? data.debtor_contact.replace(/-/g, '') : '') ||
    '',
  });

  const [errorStatus, setErrorStatus] = useState({
    title: '',
    name: '',
    id: '',
    address: '',
    contact: '',
  });

  // 연락처 하이픈 자동 삽입
  const formatPhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 7)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  const formatUserId = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    if (numbersOnly.length <= 6) return numbersOnly;
    return `${numbersOnly.slice(0, 6)}-${numbersOnly.slice(6, 13)}`;
  };

  const checkValidation = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'title':
        if (value.length == 0 || value.length >= 80) error = '제목은 80자 미만으로 작성해주세요.';
        break;
      case 'name':
        if (!/^[가-힣a-zA-Z]{2,20}$/.test(value.trim()))
          error = '이름은 특수문자, 숫자 제외 작성해주세요.';
        break;
      case 'address':
        if (value.length == 0|| value.length >= 60) error = '주소는 60자 미만으로 작성해주세요.';
        break;
      case 'id':
        // Check the raw number input without hyphens
        const idWithoutHyphens = value.replace(/-/g, '');
        if (!/^\d{0,13}$/.test(idWithoutHyphens))
          error = '주민번호는 (-)를 제외한 13자리 숫자로만 작성해주세요.';
        else if (idWithoutHyphens.length != 13)
          error = '주민번호는 13자리여야 합니다.';
        break;
      case 'contact':
        // Check the raw number input without hyphens
        const contactWithoutHyphens = value.replace(/-/g, '');
        if (contactWithoutHyphens.length != 11)
          error = '전화번호는 11자리여야 합니다.';
        else if (!/^\d*$/.test(contactWithoutHyphens))
          error = '연락처는 숫자로만 작성해주세요';
        break;
      default:
        break;
    }
    setErrorStatus((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // 입력값 변경 핸들러 (실시간 하이픈 포맷팅 추가)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Apply formatting as the user types
    if (name === 'contact') {
      // Remove existing hyphens first then format
      const rawValue = value.replace(/-/g, '');
      // Only keep digits
      const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 11);
      formattedValue = formatPhoneNumber(digitsOnly);
      console.log(formattedValue);
    } 
    else if (name === 'id') {
      // Remove existing hyphens first then format
      const rawValue = value.replace(/-/g, '');
      // Only keep digits
      const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 13);
      formattedValue = formatUserId(digitsOnly);
    }
    else {
      formattedValue = value;
    }
    
    checkValidation(name, formattedValue);
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // 전체 필드 유효성 검사
  const validateAllFields = () => {
    let valid = true;
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (checkValidation(field, value)) valid = false;
    });
    return valid;
  };

  // 데이터 저장 및 유효성 검사
  const handleSenderData = () => {
    if (!validateAllFields()) {
      return;
    } else {
      const updatedData =
        role === '채권자'
          ? {
              title: formData.title,
              creditor_name: formData.name,
              creditor_id: formData.id, // Already formatted
              creditor_address: formData.address,
              creditor_contact: formData.contact, // Already formatted
            }
          : {
              title: formData.title,
              debtor_name: formData.name,
              debtor_id: formData.id, // Already formatted
              debtor_address: formData.address,
              debtor_contact: formData.contact, // Already formatted
            };

      handleData(updatedData);
      navigate('/docs/detail/G1/money');
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <atoms.ProgressBar curStage={1} totalStage={6} />
      <div className="flex flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-2">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={role + ' 정보'}
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-2">
            <div>
              <atoms.Input
                className={errorStatus.title ? 'ring-1 ring-red-500' : ''}
                name="title"
                value={formData.title}
                label="문서 제목"
                onChange={handleChange}
              />
              <p
                className={
                  'text-xs text-red-500 ' + (errorStatus.title ? '' : 'hidden')
                }
              >
                {errorStatus.title}
              </p>
            </div>
            <div>
              <atoms.Input
                className={errorStatus.name ? 'ring-1 ring-red-500' : ''}
                name="name"
                value={formData.name}
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
                value={formData.id}
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
                value={formData.address}
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
                value={formData.contact}
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