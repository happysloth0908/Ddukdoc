// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SsafyRoundButton } from '@/components/atoms/buttons/SsafyRoundButton';
// import { FiFile, FiStar } from 'react-icons/fi';

const meta: Meta<typeof SsafyRoundButton> = {
  title: 'Components/Buttons/SsafyRoundButton',
  component: SsafyRoundButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: false },
    children: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SsafyRoundButton>;

export const WithIcon: Story = {
  args: {
    children: '공유',
    icon: <span className="">📄</span>,
  },
};
