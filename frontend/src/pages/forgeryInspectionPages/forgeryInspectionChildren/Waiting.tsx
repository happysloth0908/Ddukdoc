// import Forgery from '@/assets/images/forgeryInspection';
import { Viewer } from '@/components/atoms/three/Viewer';
export const Waiting = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <div className="mb-2 text-info-large font-bold">
        문서를 검증 중입니다.
      </div>
      <div>블록체인 Hash 검증을 통해 </div>
      <div>위조가 되었는지 검증해드릴게요!</div>
      {/* <img src={Forgery.ChainGlass} className="my-7 w-44" /> */}
      <Viewer />
    </div>
  );
};
