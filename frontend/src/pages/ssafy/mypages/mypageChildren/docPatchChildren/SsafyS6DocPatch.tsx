import { useS6Data } from '@/store/docs';
import atoms from '@/components/atoms';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '@/apis/ssafy/mypage';
import { ApiResponse, DocData } from '@/types/mypage';

interface FieldData {
  field_id: number;
  role_id: number;
  field_name: string;
  is_required: boolean;
  type: string;
  order: number;
  group: string;
  field_value: string;
}

interface apiResponse extends ApiResponse {
  data: {
    docs_info: DocData;
    field: FieldData[];
  };
  timestamp: string;
}

const SsafyS6DocPatch = () => {
  const { data, setData } = useS6Data();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    project_name: '',
    birth: '',
    name: '',
  });

  const [errorStatus, setErrorStatus] = useState({
    project_name: '',
    birth: '',
    name: '',
  });

  const fetchData = async () => {
    const docId = id ? parseInt(id) : 0;
    const res = await apiClient.get<apiResponse>(`/api/ssafy/docs/${docId}`);

    const fieldData = res.data.data.field.reduce(
      (acc: Record<string, string>, field: FieldData) => {
        acc[field.field_name] = field.field_value;
        return acc;
      },
      {}
    );

    const mappedData = {
      project_name: fieldData.project_name || '',
      birth: fieldData.student_birthdate || '',
      name: fieldData.student_name || '',
    };

    setData(mappedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        project_name: data.project_name || '',
        birth: data.birth || '',
        name: data.name || '',
      });
    }
  }, [data]);

  const checkValidation = (name: string, value: string): boolean => {
    let errorMsg = '';

    const isAllFieldsEmpty = Object.values(formData).every(
      (v) => v.trim() === ''
    );

    if (isAllFieldsEmpty) {
      errorMsg = '모든 항목을 입력해주세요.';
    } else {
      switch (name) {
        case 'project_name':
          if (!value.trim()) {
            errorMsg = '프로젝트 이름을 입력해주세요.';
          } else if (value.length > 20) {
            errorMsg = '프로젝트 이름은 20자 이하여야 합니다.';
          }
          break;

        case 'birth':
          if (!value) {
            errorMsg = '생년월일을 입력해주세요.';
          }
          break;

        case 'name':
          if (!/^[가-힣a-zA-Z]{2,20}$/.test(value.trim()))
            errorMsg = '이름은 특수문자, 숫자 제외 작성해주세요.';
          break;
      }
    }

    setErrorStatus((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg !== '';
  };

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
      project_name: formData.project_name,
      birth: formData.birth,
      name: formData.name,
    };

    setData(updatedData);
    navigate(`/ssafy/mypage/sign/${id}`, { state: { templateCode: 'S6' } });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <atoms.ProgressBar curStage={1} totalStage={2} />
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="m-1 flex w-full flex-col gap-y-6">
          <atoms.DocsDescription
            title="정보를 입력해주세요"
            subTitle={'프로젝트 활용 동의서'}
            description="를 수정하고 있어요"
          />
          <form className="flex flex-col gap-y-6">
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
                className={errorStatus.birth ? 'ring-1 ring-red-500' : ''}
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
                className={errorStatus.name ? 'ring-1 ring-red-500' : ''}
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

export default SsafyS6DocPatch;
