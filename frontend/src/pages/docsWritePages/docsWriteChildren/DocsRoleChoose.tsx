import atoms from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import DefaultIcons from '@/assets/images/default';
import { useIOUDocsStore } from '@/store/docs';
import { useEffect } from 'react';

export const DocsRoleChoose = ({
  templateCode,
  role,
  onRole,
}: {
  templateCode: string;
  role: string;
  onRole: (code: string) => void;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (templateCode == '') {
      navigate("/", { replace: true });
    }
  }, []);
  const { resetData } = useIOUDocsStore();
  const handleSelect = (id: string) => {
    onRole(id);
  };

  const handleClick = () => {
    resetData();
    navigate('/docs/detail/' + templateCode);

  }
  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 justify-center flex-col gap-y-6">
        <p className="text-info-large font-bold">
          어느 입장에서 문서를
          <br />
          작성하시나요?
        </p>
        <atoms.RoleSelectCard
          children="채권자 (빌려주는 사람)"
          id="채권자"
          isSelected={role === '채권자' ? true : false}
          icon={DefaultIcons.MoneyGiveIcon}
          onToggleClick={handleSelect}
          className="text-info-small font-bold"
        />
        <atoms.RoleSelectCard
          children="채무자 (빌리는 사람)"
          id="채무자"
          isSelected={role === '채무자' ? true : false}
          icon={DefaultIcons.MoneyRecieveIcon}
          onToggleClick={handleSelect}
          className="text-info-small font-bold"
        />
      </div>
      <atoms.LongButton onClick={handleClick} className="mb-20" children="다음" colorType="black" />
    </div>
  );
};
