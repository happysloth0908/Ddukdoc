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
      id: 1,
      material_id: 1,
      title: '급여명세서',
      user_name: '홍길동',
      updated_at: '2024-03-20T09:00:00.000Z',
      user_id: 1234,
      format: 'pdf',
      created_at: '2024-03-20T09:00:00.000Z',
    },
    onDelete: (id) => console.log('Delete file with id:', id),
  },
};

export const ImageFile: Story = {
  args: {
    data: {
      id: 2,
      material_id: 2,
      title: '신분증',
      user_name: '김철수',
      updated_at: '2024-03-20T10:00:00.000Z',
      user_id: 5678,
      format: 'jpg',
      created_at: '2024-03-20T10:00:00.000Z',
    },
    onDelete: (id) => console.log('Delete file with id:', id),
  },
};
