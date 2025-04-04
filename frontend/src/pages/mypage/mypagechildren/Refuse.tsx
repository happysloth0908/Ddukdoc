import Textarea from '@/components/atoms/inputs/Textarea.tsx';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { useState } from 'react';

const Refuse = () => {
  const [content, setContent] = useState('');

  // 롱버튼에 api전송하는거 연결하고, DocDetail에서 반송 누르면 이거 바텀롤업 이용해서 뜨도록 설정
  return (
    <div className={'flex flex-col items-center space-y-6'}>
      <div>
        <p>반송 사유</p>
      </div>
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <LongButton children={'반송'} colorType={'warning'} />
    </div>
  );
};

export default Refuse;
