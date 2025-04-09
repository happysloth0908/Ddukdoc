import { useS6Data } from '@/store/docs';
import atoms from '@/components/atoms';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSsafyMyStore } from '@/store/ssafyMyInfoStore';

export const S6WriteData = () => {
  const { data, setData } = useS6Data();
  const navigate = useNavigate();
  const ssafyInfo = useSsafyMyStore();

  const [formData, setFormData] = useState({
    project_name: data.project_name || "",
    birth: data.birth || "",
    name: data.name || ssafyInfo.data.name || "",
  });

  const [errorStatus, setErrorStatus] = useState({
    date: "",
    project_name: "",
    birth: "",
    name: "",
  });

  // 개별 필드 유효성 검사 함수
  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';
  
    // const isAllFieldsEmpty = Object.values(formData).every(v => v.trim() === '');
  
    // if (isAllFieldsEmpty) {
    //   errorMsg = '모든 항목을 입력해주세요.';
    // } else {
      switch (name) {
  
        case 'birth':
          if (!value) {
            errorMsg = '생년월일을 입력해주세요.';
          }
          break;
  
        case 'project_name':
          if (!value.trim()) {
            errorMsg = '학번을 입력해주세요.';
          } else if (value.length > 20) {
            errorMsg = '학번은 20자 이하여야 합니다.';
          }
          break;
  
        case 'name':
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
      const newVal = value;
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

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // "2025-04-08"
    
    const updatedData = {
      date: formattedDate,
      project_name: formData.project_name,
      birth: formData.birth,
      name: formData.name,
    };

    setData(updatedData);
    navigate('/ssafy/docs/detail/S6/signature');
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <atoms.ProgressBar curStage={3} totalStage={6} />
      <div className="flex flex-1 w-full items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-6">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={'프로젝트 활용 동의서'}
            description="를 입력하고 있어요"
          />
          <form className="flex flex-col gap-y-4">

            <div>
              <atoms.Input
                className={
                  errorStatus.project_name ? 'ring-1 ring-red-500' : ''
                }
                name="project_name"
                defaultValue={formData.project_name}
                label="프로젝트 이름"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.project_name ? '' : 'hidden'
                }`}
              >
                {errorStatus.project_name}
              </p>
            </div>

            <div>
              <atoms.DateInput
                className={
                  errorStatus.birth ? 'ring-1 ring-red-500' : ''
                }
                name="birth"
                defaultValue={formData.birth}
                label="생년월일"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.birth ? '' : 'hidden'
                }`}
              >
                {errorStatus.birth}
              </p>
            </div>

            <div>
              <atoms.Input
                className={
                  errorStatus.name
                    ? 'ring-1 ring-red-500'
                    : ''
                }
                name="name"
                defaultValue={formData.name}
                label="이름"
                onChange={handleChange}
              />
              <p
                className={`text-xs text-red-500 ${
                  errorStatus.name ? '' : 'hidden'
                }`}
              >
                {errorStatus.name}
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
