// src/stories/SignBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SignBox } from '../../components/molecules/SignBox.tsx';

const meta: Meta<typeof SignBox> = {
  title: 'Components/Molecules/SignBox',
  component: SignBox,
  parameters: {
    layout: 'fullscreen', // ✅ 뷰포트 전체 사용 (centered는 안 맞을 수 있음)
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SignBox>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          width: '390px',
          height: '844px',
          border: '1px solid #ccc',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <SignBox next='test' role='test' />
      </div>
    </div>
  ),
};
