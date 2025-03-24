import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Input, { InputProps } from '../../components/atoms/inputs/Input.tsx';

export default {
  title: 'Components/Inputs/Input',
  component: Input,
} as Meta;

const Template: StoryFn<InputProps> = (args) => {
  const [value, setValue] = useState(args.value || '');
  return <Input {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default Input',
  placeholder: '텍스트를 입력해 주세요...',
  value: '',
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  label: 'Input with Helper Text',
  placeholder: '텍스트를 입력해 주세요...',
  helperText: '도움말 텍스트 (현재 컴포넌트에선 렌더링 되지 않음)',
  value: '',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  placeholder: '라벨 없이 입력...',
  value: '',
};
