import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Textarea, { TextareaProps } from '../../components/inputs/Textarea';

export default {
  title: 'Components/Textarea',
  component: Textarea,
} as Meta;

const Template: StoryFn<TextareaProps> = (args) => {
  const [value, setValue] = useState(args.value || '');
  return <Textarea {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {
  placeholder: '추가 내용을 입력하세요.',
  value: '',
};

export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
  value:
    '미리 입력된 텍스트입니다.\n여러 줄 입력이 가능합니다.\n세 번째 줄입니다.',
  placeholder: '추가 내용을 입력하세요.',
};
