import { Meta, StoryObj } from '@storybook/react';
import Textarea, { TextareaProps } from '@/components/atoms/inputs/Textarea';
import { ChangeEvent } from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

const Template = (args: TextareaProps) => {

  return <Textarea {...args} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => e} />;
};

export const Default: StoryObj<typeof Textarea> = {
  render: Template,
  args: {
    placeholder: 'Enter your text...',
  },
};

export const Disabled: StoryObj<typeof Textarea> = {
  render: Template,
  args: {
    placeholder: 'Cannot type...',
    disabled: true,
  },
};
