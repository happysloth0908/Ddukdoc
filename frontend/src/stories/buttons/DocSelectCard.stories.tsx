// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import DocSelectCard from '@/components/atoms/buttons/DocSelectCard';
// import { FiFile, FiStar } from 'react-icons/fi';

const meta: Meta<typeof DocSelectCard> = {
  title: 'Components/Buttons/DocSelectCard',
  component: DocSelectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onToggleClick: { action: 'clicked' },
    isSelected: { control: 'boolean' },
    icon: { control: false },
    children: { control: 'text' },
    id: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof DocSelectCard>;

export const Default: Story = {
  args: {
    children: 'Document Card',
    id: 'doc-1',
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Document',
    id: 'doc-2',
    isSelected: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Document with Icon ',
    id: 'doc-3',
    isSelected: false,
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
    id: 'doc-4',
    isSelected: true,
    icon: (
      <span className="ml-2 inline-block h-5 w-5 rounded-sm bg-gray-400">
        📄
      </span>
    ),
  },
};
