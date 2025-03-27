// DocSelectCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from '@/components/atoms/buttons/RadioButton';

const meta: Meta<typeof RadioButton> = {
  component: RadioButton,
  title: 'Components/Buttons/RadioButton',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  args: {
    id: 'default-radio',
    name: 'radio-group',
    value: 'default',
    label: '기본 라디오 버튼',
    checked: false,
    className: '',
  },
};

export const Checked: Story = {
  args: {
    id: 'checked-radio',
    name: 'radio-group',
    value: 'checked',
    label: '선택된 라디오 버튼',
    checked: true,
    className: '',
  },
};

export const WithCustomClass: Story = {
  args: {
    id: 'custom-radio',
    name: 'radio-group',
    value: 'custom',
    label: '커스텀 스타일 라디오 버튼',
    checked: false,
    className: 'font-bold ',
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <RadioButton
        id="option1"
        name="group-example"
        value="option1"
        label="옵션 1"
        checked={true}
        onChange={() => console.log('옵션 1 선택됨')}
        className=""
      />
      <RadioButton
        id="option2"
        name="group-example"
        value="option2"
        label="옵션 2"
        checked={false}
        onChange={() => console.log('옵션 2 선택됨')}
        className=""
      />
      <RadioButton
        id="option3"
        name="group-example"
        value="option3"
        label="옵션 3"
        checked={false}
        onChange={() => console.log('옵션 3 선택됨')}
        className=""
      />
    </div>
  ),
};
