import type { Meta, StoryObj } from '@storybook/react';
import { CompletePage } from '../components/atoms/infos/CompletePage';

const meta: Meta<typeof CompletePage> = {
  title: 'Components/Infos/CompletePage',
  component: CompletePage,
  argTypes: {
    type: {
      control: 'radio',
      options: ['share', 'save', 'invalid'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CompletePage>;

export const Share: Story = {
  args: {
    type: 'share',
  },
};

export const Save: Story = {
  args: {
    type: 'save',
  },
};

export const Invalid: Story = {
  args: {
    type: 'invalid',
  },
};
