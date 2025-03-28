import { Meta, StoryObj } from '@storybook/react';
import DateInput, { DateInputProps } from '@/components/atoms/inputs/DateInput';
import { ChangeEvent } from 'react';

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  argTypes: {
    label: { control: 'text' },
    minDate: { control: 'text' },
    maxDate: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

const Template = (args: DateInputProps) => {

  return <DateInput {...args} onChange={(e: ChangeEvent<HTMLInputElement>) => e} />;
};

export const Default: StoryObj<typeof DateInput> = {
  render: Template,
  args: {
    label: 'Select a date',
    minDate: '2023-01-01',
    maxDate: '2030-12-31',
  },
};

export const Disabled: StoryObj<typeof DateInput> = {
  render: Template,
  args: {
    label: 'Disabled Date Input',
    disabled: true,
  },
};
