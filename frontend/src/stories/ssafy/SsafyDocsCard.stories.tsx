import type { Meta, StoryObj } from '@storybook/react';
import { SsafyDocsCard } from '@/components/molecules/cards/SsafyDocsCard';

const meta = {
  title: 'SSAFY/DocsCard',
  component: SsafyDocsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SsafyDocsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      document_id: 1,
      template_id: 1,
      template_code: '합격',
      template_name: '합격증',
      title: 'SSAFY 10기 합격자',
      status: '서명 완료',
      creator_id: 1,
      creator_name: '홍길동',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:00:00Z',
      creator_signature: '(base64)signature',
    },
  },
};

export const Rejected: Story = {
  args: {
    data: {
      document_id: 2,
      template_id: 2,
      template_code: '불합격',
      template_name: '불합격 통지서',
      title: 'SSAFY 10기 불합격자',
      status: '반송',
      creator_id: 1,
      creator_name: '홍길동',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:00:00Z',
      creator_signature: '(base64)signature',
    },
  },
};

export const WithPatchHandler: Story = {
  args: {
    data: {
      document_id: 3,
      template_id: 1,
      template_code: '합격',
      template_name: '합격증',
      title: 'SSAFY 10기 합격자',
      status: '서명 대기',
      creator_id: 1,
      creator_name: '홍길동',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:00:00Z',
      creator_signature: '(base64)signature',
    },
    onPatch: (id) => {
      console.log(`Patch document with id: ${id}`);
    },
  },
};
