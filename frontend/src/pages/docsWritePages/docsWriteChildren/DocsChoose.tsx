import { Link } from 'react-router-dom';
import atoms from '@/components/atoms';
import DefaultIcons from "@/assets/images/default";

export const DocsChoose = ({ templateCode, onTemplateCode }: { templateCode: string, onTemplateCode: (code: string) => void}) => {

  const handleSelect = (id: string) => {
    onTemplateCode(id);
  };

  return (
    <div className='flex-1 flex flex-col gap-y-6'>
      <div className='flex flex-col flex-1 mt-28 gap-y-6'>
        <p className='font-bold text-info-large'>
          어떤 문서를<br/>
          작성하고 싶으신가요?
        </p>
        <atoms.DocSelectCard
          onToggleClick={handleSelect}
          id='G1'
          children="차용증"
          isSelected={templateCode === 'G1' ? true : false}
          icon={DefaultIcons.BitcoinIcon}
          className='text-info-small'
        />
        <atoms.DocSelectCard
          onToggleClick={handleSelect}
          id='G2'
          children="근로계약서"
          isSelected={templateCode === 'G2' ? true : false}
          icon={DefaultIcons.PaperIcon}
          className='text-info-small'
        />
      </div>
      <Link to="check">
        <atoms.LongButton className='mb-20' children="다음" colorType='black' />
      </Link>
    </div>
  );
};
