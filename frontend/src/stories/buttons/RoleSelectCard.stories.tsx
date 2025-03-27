// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import RoleSelectCard from '@/components/atoms/buttons/RoleSelectCard';
// import { FiFile, FiStar } from 'react-icons/fi';

const meta: Meta<typeof RoleSelectCard> = {
  title: 'Components/Buttons/RoleSelectCard',
  component: RoleSelectCard,
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
type Story = StoryObj<typeof RoleSelectCard>;

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
    icon: '',
  },
};

export const SelectedWithIcon: Story = {
  args: {
    children: 'Selected Document with Icon ',
    id: 'doc-4',
    isSelected: true,
    icon: '',
  },
};
