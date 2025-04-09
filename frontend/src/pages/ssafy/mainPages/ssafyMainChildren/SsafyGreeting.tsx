import { useSsafyMyStore } from '@/store/ssafyMyInfoStore';
import { SsafyLoginMainSVG } from '@/assets/images/ssafy';
export const SsafyGreeting = () => {
  const { data } = useSsafyMyStore();
  return (
    <div className="bg-ssafy-b1 relative flex w-full flex-row items-center justify-center rounded-xl p-3">
      <img
        className="mr-4 h-5 w-5"
        src={SsafyLoginMainSVG.wave_hand}
        alt="Wave hand"
      />
      <div className="flex flex-row items-center justify-center font-semibold text-white">
        <div className="font-bold">{data.name}</div>
        <div className="">님, 안녕하세요!</div>
      </div>
    </div>
  );
};
