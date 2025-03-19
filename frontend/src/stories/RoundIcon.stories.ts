import type { Meta, StoryObj } from "@storybook/react";
import { RoundIcon } from "@/components/atoms/infos/RoundIcon";

const meta: Meta<typeof RoundIcon> = {
  title: "Components/RoundIcon", // Storybook 내에서 컴포넌트를 표시할 경로
  component: RoundIcon, // 사용할 컴포넌트
  argTypes: {
    isRejected: {
      control: "radio", // 라디오 버튼으로 선택할 수 있게 설정
      options: [true, false], // "반송"과 "정상" 상태로 옵션 제공
    },
  },
};

export default meta;

type Story = StoryObj<typeof RoundIcon>;

export const Rejected: Story = {
  args: {
    isRejected: true, // 반송 상태에서 아이콘을 표시
  },
};

export const NotRejected: Story = {
  args: {
    isRejected: false, // 정상 상태에서 아이콘을 표시
  },
};
