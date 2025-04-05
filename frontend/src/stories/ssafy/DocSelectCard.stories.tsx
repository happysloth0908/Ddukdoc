import { Meta, StoryObj } from '@storybook/react';
import DocSelectCard from '@/components/atoms/ssafy/buttons/DocSelectCard';

// Meta 정의
export default {
  title: 'Components/ssafy/DocSelectCard',
  component: DocSelectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onToggleClick: { action: 'clicked' },
    isSelected: { control: 'boolean' },
    icon: { control: 'text' },
    id: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    className: { control: 'text' },
  },
} as Meta<typeof DocSelectCard>;

// Story 타입 정의
type Story = StoryObj<typeof DocSelectCard>;

// 기본 스토리
export const Default: Story = {
  args: {
    id: 'doc1',
    title: '문서 제목',
    description: '이 문서는 기본 템플릿입니다.',
    isSelected: false,
    icon: '/icons/document.svg',
    className: '',
  },
};

// 선택된 상태 스토리
export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

// 아이콘 없는 스토리
export const NoIcon: Story = {
  args: {
    ...Default.args,
    icon: undefined,
  },
};

// 긴 설명 텍스트 스토리
export const LongDescription: Story = {
  args: {
    ...Default.args,
    description: '이 문서는 매우 긴 설명을 가지고 있습니다. 이 설명이 어떻게 표시되는지 확인하기 위한 예시입니다. 텍스트가 잘리거나 줄바꿈되는지 확인합니다.',
  },
};

// 커스텀 클래스 스토리
export const CustomClass: Story = {
  args: {
    ...Default.args,
    className: 'gap-4 flex-col',
  },
};