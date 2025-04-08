import errorIcon from '@/assets/images/default/error_icon.svg';
import LongButton from '@/components/atoms/buttons/LongButton';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    if (location.state?.fromSsafy) {
      console.log('싸피에서 왔으므로 싸피로 돌아갑니다. ');
      navigate('/ssafy', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div></div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center text-info-large">404 ERROR</div>
        <img src={errorIcon} className="my-5 h-1/4" />
        <div className="text-center">
          길을 잃었따... 빰빰빠 <br /> 어딜가야 할까{' '}
        </div>
      </div>
      <LongButton className="mb-20" colorType="black" onClick={goHome}>
        홈으로
      </LongButton>
    </div>
  );
};
