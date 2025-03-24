import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import BottomRollup, {
  BottomRollupProps,
} from '../../components/atoms/inputs/BottomRollup';

export default {
  title: 'Components/Inputs/BottomRollup',
  component: BottomRollup,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const ParentComponent = ({ children, ...args }: BottomRollupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen w-full p-4">
      <button
        className="rounded-lg bg-zinc-800 px-6 py-3 text-white"
        onClick={() => setIsOpen(true)}
      >
        바텀시트 열기
      </button>
      <BottomRollup {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </BottomRollup>
    </div>
  );
};

const Template: StoryFn<BottomRollupProps> = (args) => {
  return <ParentComponent {...args}>{args.children}</ParentComponent>;
};

export const Default = Template.bind({});
Default.args = {
  children: (
    <div>
      <h2 className="text-lg font-bold">기본 바텀시트</h2>
      <p className="mt-2">바텀시트의 기본적인 사용 예시입니다.</p>
    </div>
  ),
};

export const WithLongContent = Template.bind({});
WithLongContent.args = {
  children: (
    <div>
      <h2 className="text-lg font-bold">스크롤 테스트</h2>
      {Array.from({ length: 20 }).map((_, index) => (
        <p key={index} className="mt-4">
          긴 컨텐츠 예시 {index + 1}번째 문단입니다.
        </p>
      ))}
    </div>
  ),
};

export const WithForm = Template.bind({});
WithForm.args = {
  children: (
    <div>
      <h2 className="mb-4 text-lg font-bold">폼 예시</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="이름"
          className="w-full rounded-lg border p-2"
        />
        <input
          type="email"
          placeholder="이메일"
          className="w-full rounded-lg border p-2"
        />
        <button
          type="button"
          className="w-full rounded-lg bg-zinc-800 p-2 text-white"
        >
          제출하기
        </button>
      </form>
    </div>
  ),
};
