import { Link, useLocation } from 'react-router-dom';
import atoms from '@/components/atoms';
import DefaultIcons from '@/assets/images/default';

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
      <div className="mt-28 flex flex-1 flex-col gap-y-6">
        <p className="text-info-large font-bold">
          어떤 문서를
          <br />
          작성하고 싶으신가요?
        </p>
        <atoms.DocSelectCard
          onToggleClick={handleSelect}
          id="G1"
          children="차용증"
          isSelected={templateCode === 'G1' ? true : false}
          icon={DefaultIcons.BitcoinIcon}
          className="text-info-small"
        />
        <atoms.DocSelectCard
          onToggleClick={handleSelect}
          id="G2"
          children="근로계약서"
          isSelected={templateCode === 'G2' ? true : false}
          icon={DefaultIcons.PaperIcon}
          className="text-info-small"
        />
      </div>
      <Link to="check" state={{ from: currentPath }}>
        <atoms.LongButton className="mb-20" children="다음" colorType="black" />
      </Link>
    </div>
  );
};
