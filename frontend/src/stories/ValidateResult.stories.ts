import type { Meta, StoryObj } from '@storybook/react';
import { ValidateResult } from '../components/atoms/infos/ValidateResult';

const meta: Meta<typeof ValidateResult> = {
  title: 'Components/Infos/ValidateResult',
  component: ValidateResult,
  argTypes: {
    status: { control: 'boolean' },
    fileTitle: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ValidateResult>;

export const ValidDocument: Story = {
  args: {
    status: true,
    fileTitle: '착한 문서',
  },
};

export const InvalidDocument: Story = {
  args: {
    status: false,
    fileTitle: '나쁜 문서',
  },
};
