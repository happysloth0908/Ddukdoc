// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SsafyMenuButton from '@/components/atoms/buttons/SsafyMenuButton';
// import { FiFile, FiStar } from 'react-icons/fi';

const meta: Meta<typeof SsafyMenuButton> = {
  title: 'Components/Buttons/SsafyMenuButton',
  component: SsafyMenuButton,
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
type Story = StoryObj<typeof SsafyMenuButton>;

export const Default: Story = {
  args: {
    children: 'Document Card',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Document',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Document with Icon ',
    icon: (
      <span className="ml-2 inline-block h-5 w-5 rounded-sm bg-gray-400">
        📄
      </span>
    ),
  },
};

export const SelectedWithIcon: Story = {
  args: {
    children: 'Selected Document with Icon ',
    icon: (
      <span className="ml-2 inline-block h-5 w-5 rounded-sm bg-gray-400">
        📄
      </span>
    ),
  },
};
