import type { Meta, StoryObj } from '@storybook/react';
import { SsafyMyInfoBox } from '../../components/atoms/infos/SsafyMyInfoBox.tsx';

const meta: Meta<typeof SsafyMyInfoBox> = {
  title: 'Components/Infos/SsafyMyInfoBox',
  component: SsafyMyInfoBox,
  argTypes: {
    name: { control: 'text' },
    email: { control: 'text' },
    locate: { control: 'text' },
    pid: { control: 'number' },
    status: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof SsafyMyInfoBox>;

export const Default: Story = {
  args: {
    name: '홍석진짱짱맨',
    email: 'hong@example.com',
    locate: '대전',
    pid: 7777777,
    status: '재학 중',
  },
};

export const Graduated: Story = {
  args: {
    name: '김철수',
    email: 'kim@example.com',
    locate: '서울',
    pid: 98765432,
    status: '졸업',
  },
};
