import { useS1Data } from '@/store/docs';
import atoms from '@/components/atoms';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DocsWriteData = () => {
  const { data, setData } = useS1Data();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    export_date: data.export_date || "",
    return_due_date: data.return_due_date || "",
    location: data.location || "",
    student_id: data.student_id || "",
    contact_number: data.contact_number || "",
    applicant_name: data.applicant_name || ""
  });

  const [errorStatus, setErrorStatus] = useState({
    export_date: "",
    return_due_date: "",
    location: "",
    student_id: "",
    contact_number: "",
    applicant_name: "",
  });

  const formatPhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '');
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 7)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  // 개별 필드 유효성 검사 함수
  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';
  
    // const isAllFieldsEmpty = Object.values(formData).every(v => v.trim() === '');
  
    // if (isAllFieldsEmpty) {
    //   errorMsg = '모든 항목을 입력해주세요.';
    // } else {
      switch (name) {
        case 'export_date':
          if (!value) {
            errorMsg = '반출 일자를 입력해주세요.';
          } else if (formData.return_due_date && new Date(value) > new Date(formData.return_due_date)) {
            errorMsg = '반출 일자는 반입 일자보다 빠른 날짜여야 합니다.';
          }
          break;
  
        case 'return_due_date':
          if (!value) {
            errorMsg = '반입 일자를 입력해주세요.';
          } else if (formData.export_date && new Date(formData.export_date) > new Date(value)) {
            errorMsg = '반입 일자는 반출 일자보다 느린 날짜여야 합니다.';
          }
          break;
  
        case 'location':
          if (!value.trim()) {
            errorMsg = '소속을 입력해주세요.';
          } else if (value.length > 20) {
            errorMsg = '소속은 20자 이하여야 합니다.';
          }
          break;
  
        case 'student_id':
          if (!value.trim()) {
            errorMsg = '학번을 입력해주세요.';
          } else if (value.length > 20) {
            errorMsg = '학번은 20자 이하여야 합니다.';
          }
          break;
  
        case 'contact_number':
          if (value.length != 11) errorMsg = '전화번호는 (-)를 제외한 11자리를 입력해주세요.';
          else if (!/^\d{3}-\d{4}-\d{4}$/.test(formatPhoneNumber(value)))
            errorMsg = '연락처는 (-)제외 숫자로만 작성해주세요';
          break;
  
        case 'applicant_name':
          if (!/^[가-힣a-zA-Z]{2,20}$/.test(value.trim()))
            errorMsg = '이름은 특수문자, 숫자 제외 작성해주세요.';
          break;
      }
    // }
  
    setErrorStatus((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg !== '';
  };
  
  

  // 전체 필드 유효성 검사
  const validateAllFields = () => {
    let hasError = false;
    Object.entries(formData).forEach(([name, value]) => {
      let newVal = value;
      if (name == 'contact_number') newVal = value.replace(/-/g, '')
      if (checkValidation(name, newVal)) {
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
      export_date: formData.export_date,
      return_due_date: formData.return_due_date,
      location: formData.location,
      student_id: formData.student_id,
      contact_number: formatPhoneNumber(formData.contact_number),
      applicant_name: formData.applicant_name,
    };

    setData(updatedData);
    navigate('/ssafy/docs/detail/S1/signature');
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <atoms.ProgressBar curStage={3} totalStage={6} />
      <div className="flex flex-1 w-full items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-6">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={'노트북 반출 서류'}
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-2">
            <div>
              <atoms.DateInput
                className={
                  errorStatus.export_date ? 'ring-1 ring-red-500' : ''
                }
                name="export_date"
                defaultValue={formData.export_date}
                label="반출 일자(들고 나가는 날짜)"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.export_date ? '' : 'hidden'
                }`}
              >
                {errorStatus.export_date}
              </p>
            </div>

            <div>
              <atoms.DateInput
                className={
                  errorStatus.return_due_date ? 'ring-1 ring-red-500' : ''
                }
                name="return_due_date"
                defaultValue={formData.return_due_date}
                label="반입 일자(들고 들어오는 날짜)"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.return_due_date ? '' : 'hidden'
                }`}
              >
                {errorStatus.return_due_date}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.location ? 'ring-1 ring-red-500' : ''
                }
                name="location"
                defaultValue={formData.location}
                label="소속 (예. 대전 1반)"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.location ? '' : 'hidden'
                }`}
              >
                {errorStatus.location}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.student_id ? 'ring-1 ring-red-500' : ''
                }
                name="student_id"
                defaultValue={formData.student_id}
                label="학번"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.student_id ? '' : 'hidden'
                }`}
              >
                {errorStatus.student_id}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.contact_number
                    ? 'ring-1 ring-red-500'
                    : ''
                }
                name="contact_number"
                defaultValue={formData.contact_number ? formData.contact_number.replace(/-/g, '') : ''}
                label="연락처"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.contact_number ? '' : 'hidden'
                }`}
              >
                {errorStatus.contact_number}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.applicant_name
                    ? 'ring-1 ring-red-500'
                    : ''
                }
                name="applicant_name"
                defaultValue={formData.applicant_name}
                label="이름"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.applicant_name ? '' : 'hidden'
                }`}
              >
                {errorStatus.applicant_name}
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
