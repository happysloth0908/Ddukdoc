import { apiClient } from '@/apis/ssafy/mypage';
import atoms from '@/components/atoms';
import { DocsDescription } from '@/components/atoms/infos/DocsDescription';
import { useShareInfoStore } from '@/store/mmStore';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

const MmLogin = () => {
  const { id } = useParams();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(loginId)) {
      setIdError('아이디는 이메일 형식입니다');
      isValid = false;
    } else {
      setIdError('');
    }

    if (!password) {
      setPasswordError('비밀번호를 입력하지 않았습니다');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const response = await apiClient.post('/api/share/mm/login', {
          id: loginId,
          password: password,
        });

        useShareInfoStore.setState({
          user_id: response.data.data.user_id,
          token: response.data.data.token,
        });

        navigate(`/ssafy/mypage/share/${id}/select`);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.error.code);
        }
        alert('아이디 또는 비밀번호가 잘못되었습니다');
      }
    }
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex w-full flex-col justify-center gap-y-20">
        <DocsDescription
          title={'로그인 정보를 입력해주세요'}
          subTitle={'MatterMost'}
          description={' 로그인'}
        />
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col">
            <atoms.Input
              placeholder="아이디를 입력해주세요"
              className="w-1/2 rounded-md border border-gray-300"
              onChange={(e) => setLoginId(e.target.value)}
              onBlur={() => {
                if (loginId && !validateEmail(loginId)) {
                  setIdError('아이디는 이메일 형식입니다');
                } else {
                  setIdError('');
                }
              }}
              type="email"
              label="아이디"
            />
            {idError && (
              <span className="mt-1 text-sm text-red-500">{idError}</span>
            )}
          </div>
          <div className="flex flex-col">
            <atoms.Input
              placeholder="비밀번호를 입력해주세요"
              className="w-1/2 rounded-md border border-gray-300"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                if (!password) {
                  setPasswordError('비밀번호를 입력하지 않았습니다');
                } else {
                  setPasswordError('');
                }
              }}
              type="password"
              label="비밀번호"
            />
            {passwordError && (
              <span className="mt-1 text-sm text-red-500">{passwordError}</span>
            )}
          </div>
        </div>
        <atoms.LongButton
          colorType="black"
          className="my-20"
          onClick={handleLogin}
        >
          로그인
        </atoms.LongButton>
      </div>
    </div>
  );
};

export default MmLogin;
