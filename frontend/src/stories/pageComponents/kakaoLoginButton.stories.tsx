import { Meta, StoryObj } from '@storybook/react';
import { KakaoLoginButton } from '@/pages/loginPages/loginChildren/kakaoLoginButton';
const meta = {
  title: 'Components/Login/KakaoLoginButton',
  component: KakaoLoginButton,
  parameters: {
    layout: 'centered',
    // 컴포넌트에 대한 문서 정보를 추가할 수 있습니다
    docs: {
      description: {
        component: '카카오 로그인 기능을 제공하는 버튼 컴포넌트입니다.',
      },
    },
  },
  // argTypes를 사용하여 스토리북에서 조작 가능한 props를 정의할 수 있습니다
  argTypes: {},
} satisfies Meta<typeof KakaoLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태의 스토리
export const Default: Story = {
  args: {},
};

// 로딩 상태 예시 (실제 컴포넌트에 isLoading prop이 있다면)
export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '로그인 요청 중일 때 로딩 상태를 표시합니다.',
      },
    },
  },
};

// 비활성화 상태 예시 (실제 컴포넌트에 disabled prop이 있다면)
export const Disabled: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '버튼이 비활성화된 상태입니다.',
      },
    },
  },
};
