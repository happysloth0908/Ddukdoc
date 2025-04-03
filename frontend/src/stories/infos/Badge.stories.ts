import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/atoms/infos/Badge.tsx';

const meta: Meta<typeof Badge> = {
  title: 'Components/Infos/Badge', // Storybook 내에서 컴포넌트를 표시할 경로
  component: Badge, // 사용할 컴포넌트
  argTypes: {
    type: {
      control: 'radio', // 라디오 버튼으로 선택할 수 있게 설정
      options: ['contract', 'waiting', 'reject'], // Badge의 상태로 선택 가능한 옵션들
    },
    title: { control: 'text' }, // title은 텍스트로 입력받을 수 있게 설정
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Contract1: Story = {
  args: {
    type: "G1", // 차용증 상태로 설정
    title: "차용증", // 제목 추가
  },
};

export const Contract2: Story = {
  args: {
    type: "G2", // 차용증 상태로 설정
    title: "근로계약서", // 제목 추가
  },
};

export const Waiting: Story = {
  args: {
    type: "서명 대기", // 서명 대기 상태로 설정
    title: "서명 대기", // 제목 추가
  },
};

export const Reject: Story = {
  args: {
    type: "반송", // 반송 상태로 설정
    title: "반송", // 제목 추가
  },
};
