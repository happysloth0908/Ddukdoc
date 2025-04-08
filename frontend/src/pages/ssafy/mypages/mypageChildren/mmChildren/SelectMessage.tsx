import { apiClient } from '@/apis/mypage';
import atoms from '@/components/atoms';
import { useShareInfoStore } from '@/store/mmStore';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SelectMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const { user_id, token, receiver_id, channel_id, share_type } =
    useShareInfoStore();

  const predefinedMessages = [
    '안녕하세요, 서류 전달드립니다',
    '좋은 하루 되세요, 서류 제출합니다!',
    '감사합니다!',
    '직접 입력',
  ];

  const handleShare = async () => {
    if (share_type === 'user' && receiver_id) {
      try {
        await apiClient.post(`/api/share/mm/message-user`, {
          user_id: user_id,
          token: token,
          receiver_id: receiver_id,
          document_id: id,
          message: message,
        });
        navigate(`/ssafy/mypage/success`);
      } catch (error) {
        console.error('개인 메시지 전송 중 오류가 발생했습니다:', error);
      }
    } else if (share_type === 'channel' && channel_id) {
      try {
        await apiClient.post(`/api/share/mm/message-channel`, {
          user_id: user_id,
          token: token,
          channel_id: channel_id,
          document_id: id,
          message: message,
        });
        navigate(`/ssafy/mypage/success`);
      } catch (error) {
        console.error('채널 메시지 전송 중 오류가 발생했습니다:', error);
      }
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value !== '직접 입력') {
      setMessage(value);
    } else {
      setMessage('');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 200) {
      setMessage(e.target.value);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="my-10 ml-2 text-2xl font-bold">
        보낼 메세지를 입력하세요
      </div>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        className="mb-4 w-full rounded border border-gray-300 p-2"
      >
        <option value="">메시지를 선택하세요</option>
        {predefinedMessages.map((msg) => (
          <option key={msg} value={msg}>
            {msg}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={handleTextareaChange}
        placeholder="메시지를 입력하세요"
        maxLength={200}
        rows={4}
        disabled={selectedOption !== '직접 입력'}
        className={`w-full resize-none rounded border border-gray-300 p-2 ${
          selectedOption !== '직접 입력' ? 'bg-gray-100' : ''
        }`}
      />
      <div className="mt-1 text-right text-gray-600">{message.length}/200</div>
      <atoms.LongButton className="mt-20" onClick={handleShare}>
        공유하기
      </atoms.LongButton>
    </div>
  );
};

export default SelectMessage;
