// src/stories/DocsCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DocsCard } from '@/components/molecules/cards/DocsCard';

const meta: Meta<typeof DocsCard> = {
  title: 'Molecules/Cards/DocsCard',
  component: DocsCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DocsCard>;

export const Default: Story = {
  args: {
    data: {
      document_id: 1,
      title: '근로계약서',
      creator_name: '홍길동',
      recipient_name: '김철수',
      updated_at: '2024-03-20T09:00:00.000Z',
      template_code: 'G2',
      template_name: '근로계약서',
      status: '서명 완료',
      template_id: 0,
      creator_id: 0,
      recipient_id: 0,
      created_at: '',
      return_reason: null,
    },
    calls: '수신',
  },
};

export const Outbound: Story = {
  args: {
    data: {
      document_id: 1,
      title: '근로계약서',
      creator_name: '홍길동',
      recipient_name: '김철수',
      updated_at: '2024-03-20T09:00:00.000Z',
      template_code: 'G2',
      template_name: '근로계약서',
      status: '서명 대기',
      template_id: 0,
      creator_id: 0,
      recipient_id: 0,
      created_at: '',
      return_reason: null,
    },
    calls: '발신',
  },
};

export const WithDeleteHandler: Story = {
  args: {
    ...Default.args,
    onDelete: (id) => console.log(`문서 ${id} 삭제`),
  },
};
