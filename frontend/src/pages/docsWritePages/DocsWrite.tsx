import { useState, useEffect } from 'react';
import atoms from '@/components/atoms';

export const DocsWrite = () => {
  const [templateCode, setTemplateCode] = useState('G1');

  const handleSelect = (id: string) => {
    setTemplateCode(id);
  };

  useEffect(() => {
    console.log('업데이트된 templateCode:', templateCode);
  }, [templateCode]);

  return (
    <div>
      <p>어떤 문서를</p>
      <p>작성하고 싶으신가요?</p>
      <atoms.DocSelectCard
        onToggleClick={handleSelect}
        id='G1'
        children="차용증"
        isSelected={templateCode === 'G1' ? true : false}
      />
      <atoms.DocSelectCard
        onToggleClick={handleSelect}
        id='G2'
        children="근로계약서"
        isSelected={templateCode === 'G2' ? true : false}
      />
    </div>
  );
};
