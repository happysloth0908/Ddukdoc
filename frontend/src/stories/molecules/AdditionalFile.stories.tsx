// src/stories/AdditionalFile.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AdditionalFile } from '@/components/molecules/cards/AdditionalFile';

const meta: Meta<typeof AdditionalFile> = {
  title: 'Molecules/Cards/AdditionalFile',
  component: AdditionalFile,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdditionalFile>;

export const Default: Story = {
  args: {
    data: {
      material_id: 1,
      title: '급여명세서',
      user_name: '홍길동',
      updated_at: '2024-03-20T09:00:00.000Z',
      user_id: 0,
      format: '',
      created_at: '',
    },
  },
};
