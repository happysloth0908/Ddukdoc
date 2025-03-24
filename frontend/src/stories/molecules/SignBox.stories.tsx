// src/stories/SignBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SignBox } from '../../components/molecules/SignBox.tsx';

const meta: Meta<typeof SignBox> = {
  title: 'Components/Molecules/SignBox',
  component: SignBox,
  parameters: {
    layout: 'fullscreen', // centered → fullscreen 으로 변경
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SignBox>;

// 스토리북 캔버스에 디바이스 뷰 크기 고정하기
export const Default: Story = {
  render: () => (
    <div
      style={{
        width: '390px',
        height: '844px',
        margin: '0 auto',
        border: '1px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <SignBox />
    </div>
  ),
};
