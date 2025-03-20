import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '../components/atoms/infos/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Infos/ProgressBar',
  component: ProgressBar,
  argTypes: {
    curStage: { control: { type: 'number', min: 0 } },
    totalStage: { control: { type: 'number', min: 1 } },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    curStage: 3,
    totalStage: 10,
  },
};

export const Halfway: Story = {
  args: {
    curStage: 5,
    totalStage: 10,
  },
};

export const Completed: Story = {
  args: {
    curStage: 10,
    totalStage: 10,
  },
};
