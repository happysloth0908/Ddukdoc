import type { Meta, StoryObj } from '@storybook/react';
import LongButton from '../components/atoms/buttons/LongButton';

const meta = {
  title: 'Components/LongButton',
  component: LongButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    colorType: {
      control: 'select',
      options: ['primary', 'gray', 'warning', 'black'],
      description: '버튼 색상',
    },
    onClick: { action: 'clicked' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof LongButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    colorType: 'primary',
    children: '기본 버튼',
  },
};

export const Gray: Story = {
  args: {
    colorType: 'gray',
    children: '회색 버튼',
  },
};

export const Warning: Story = {
  args: {
    colorType: 'warning',
    children: '경고 버튼',
  },
};

export const Black: Story = {
  args: {
    colorType: 'black',
    children: '검정 버튼',
  },
};
