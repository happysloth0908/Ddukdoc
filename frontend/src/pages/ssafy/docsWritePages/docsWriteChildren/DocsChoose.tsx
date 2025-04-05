import { Link, useLocation } from 'react-router-dom';
import atoms from '@/components/atoms';
import DocSelectCard from '@/components/atoms/ssafy/buttons/DocSelectCard';
import DefaultIcons from '@/assets/images/default';
import { ssafyIcons } from '@/assets/images/ssafy'

export const DocsChoose = ({
  templateCode,
  onTemplateCode,
}: {
  templateCode: string;
  onTemplateCode: (code: string) => void;
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSelect = (id: string) => {
    onTemplateCode(id);
  };

  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-1 flex-col justify-center gap-y-6">
        <p className="text-info-large font-bold">
          어떤 문서를
          <br />
          작성하고 싶으신가요?
        </p>
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S1'
          title='노트북 반출 서약서'
          description=''
          isSelected={templateCode === 'S1' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S2'
          title='노트북 수령 확인서'
          description=''
          isSelected={templateCode === 'S2' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S3'
          title='출결 확인서'
          description=''
          isSelected={templateCode === 'S3' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S4'
          title='출결 변경 요청서'
          description=''
          isSelected={templateCode === 'S4' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S5'
          title='소스코드 반출 요청서'
          description=''
          isSelected={templateCode === 'S5' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S6'
          title='프로젝트 활용 동의서'
          description=''
          isSelected={templateCode === 'S6' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
      </div>
      <Link to="check" state={{ from: currentPath }}>
        <atoms.LongButton className="mb-20" children="다음" colorType="black" />
      </Link>
    </div>
  );
};
