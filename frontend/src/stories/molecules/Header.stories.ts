// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/molecules/Header';

const meta: Meta<typeof Header> = {
  title: 'Molecules/Header',
  component: Header,

  parameters: {
    layout: 'fullscreen', // 'centered'에서 변경
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    children: 'Document',
  },
};
