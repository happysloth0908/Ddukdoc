import { Link, useLocation } from 'react-router-dom';
import atoms from '@/components/atoms';
import DocSelectCard from '@/components/atoms/ssafy/buttons/DocSelectCard';
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
      <div className="flex flex-1 flex-col justify-center gap-y-2">
        <p className="text-info-large font-bold">
          어떤 문서를
          <br />
          작성하고 싶으신가요?
        </p>
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S1'
          title='노트북 반출 서약서'
          description='노트북 반출을 위한 신청서'
          isSelected={templateCode === 'S1' ? true : false}
          icon={ssafyIcons.laptopIcon}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S2'
          title='노트북 수령 확인서'
          description='노트북 수령 확인을 위한 서류'
          isSelected={templateCode === 'S2' ? true : false}
          icon={ssafyIcons.tickboxIcon}
          disabled={true}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S3'
          title='출결 소명서'
          description='출결 상황에 대한 소명 서류'
          isSelected={templateCode === 'S3' ? true : false}
          icon={ssafyIcons.checklistIcon}
          disabled={true}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S4'
          title='출결 변경서'
          description='출결 기록 변경을 위한 서류'
          isSelected={templateCode === 'S4' ? true : false}
          icon={ssafyIcons.changeIcon}
          disabled={true}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S5'
          title='소스코드 반출 요청서'
          description='프로젝트 소스코드 반출을 위한 신청서'
          isSelected={templateCode === 'S5' ? true : false}
          icon={ssafyIcons.codeIcon}
          disabled={true}
        />
        <DocSelectCard
          onToggleClick={handleSelect}
          id='S6'
          title='프로젝트 활용 동의서'
          description='프로젝트 활용에 대한 동의 서류'
          isSelected={templateCode === 'S6' ? true : false}
          icon={ssafyIcons.likeIcon}
        />
      </div>
      <Link to="check" state={{ from: currentPath }}>
        <atoms.LongButton className="mb-20" children="다음" colorType="black" />
      </Link>
    </div>
  );
};
