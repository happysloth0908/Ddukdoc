import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import DateInput, {
  DateInputProps,
} from '../../components/atoms/inputs/DateInput';

export default {
  title: 'Components/Inputs/DateInput',
  component: DateInput,
} as Meta;

const Template: StoryFn<DateInputProps> = (args) => {
  const [value, setValue] = useState(args.value || '');
  return <DateInput {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {
  label: '날짜 선택',
  value: '',
};

export const WithDateRange = Template.bind({});
WithDateRange.args = {
  label: '날짜 선택 (범위 지정)',
  value: '',
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
};
