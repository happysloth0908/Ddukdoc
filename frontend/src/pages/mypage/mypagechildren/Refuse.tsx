import Textarea from '@/components/atoms/inputs/Textarea.tsx';
import LongButton from '@/components/atoms/buttons/LongButton.tsx';
import { useState } from 'react';
import { apiClient } from '@/apis/mypage';
import { useParams, useNavigate } from 'react-router-dom';

const Refuse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  const refuse = async () => {
    try {
      await apiClient.patch(`/api/contract/return/${id}`, {
        return_reason: content,
      });
      // replace: true로 설정하여 뒤로가기 방지
      navigate('/mypage', { replace: true });
    } catch (error) {
      console.error('반송 실패:', error);
      alert('반송에 실패했습니다.');
    }
  };

  // 롱버튼에 api전송하는거 연결하고, DocDetail에서 반송 누르면 이거 바텀롤업 이용해서 뜨도록 설정
  return (
    <div className={'flex flex-col items-center space-y-6'}>
      <div>
        <p>반송 사유</p>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="반송 사유를 입력해주세요요"
      />
      <LongButton children={'반송'} colorType={'warning'} onClick={refuse} />
    </div>
  );
};

export default Refuse;
