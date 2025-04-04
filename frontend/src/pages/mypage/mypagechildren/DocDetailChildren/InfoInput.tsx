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
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value != null) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSenderData = async () => {
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
            <atoms.Input name="name" label="이름" onChange={handleChange} />
            <atoms.Input
              name="id"
              label="주민등록번호"
              onChange={handleChange}
            />
            <atoms.Input name="address" label="주소" onChange={handleChange} />
            <atoms.Input
              name="contact"
              label="연락처"
              onChange={handleChange}
            />
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
