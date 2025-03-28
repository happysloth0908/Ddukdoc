import { Meta, StoryObj } from '@storybook/react';
import Input, { InputProps } from '@/components/atoms/inputs/Input';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

const Template = (args: InputProps) => {
  const [value, setValue] = useState('');

  return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Default: StoryObj<typeof Input> = {
  render: Template,
  args: {
    label: 'Default Label',
    placeholder: 'Enter text...',
  },
};

export const Disabled: StoryObj<typeof Input> = {
  render: Template,
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type...',
    disabled: true,
  },
};
