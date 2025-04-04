import atoms from '@/components/atoms';
import { Link } from 'react-router-dom';
import DefaultIcons from '@/assets/images/default';

export const DocsRoleChoose = ({
  templateCode,
  role,
  onRole,
}: {
  templateCode: string;
  role: string;
  onRole: (code: string) => void;
}) => {
  const handleSelect = (id: string) => {
    onRole(id);
  };

  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="mt-28 flex flex-1 flex-col gap-y-6">
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
      <Link to={'/docs/detail/' + templateCode}>
        <atoms.LongButton className="mb-20" children="다음" colorType="black" />
      </Link>
    </div>
  );
};
