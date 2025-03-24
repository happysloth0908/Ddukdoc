import type { Meta, StoryObj } from "@storybook/react";
import { AdditionalFile } from "@/components/molecules/cards/AdditionalFile";

const meta: Meta<typeof AdditionalFile> = {
  title: "Components/Molecules/Cards/AdditionalFile",
  component: AdditionalFile,
  argTypes: {
    data: {
      control: "object",
      description: "증빙자료 데이터",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AdditionalFile>;

export const Default: Story = {
  args: {
    data: {
      id: 1,
      title: "계약서 증빙 자료",
      user_id: 1001,
      user_name: "김철수",
      created_at: "2025-03-19T10:00:00Z",
      updated_at: "2025-03-19T12:30:00Z",
      format: "pdf",
    },
  },
};
