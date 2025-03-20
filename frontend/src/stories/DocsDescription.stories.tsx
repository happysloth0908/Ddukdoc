import type { Meta, StoryObj } from '@storybook/react';
import { DocsDescription } from '../components/atoms/infos/DocsDescription';

const meta: Meta<typeof DocsDescription> = {
  title: 'Components/Infos/DocsDescription',
  component: DocsDescription,
  argTypes: {
    title: { control: 'text' },
    subTitle: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof DocsDescription>;

export const Default: Story = {
  args: {
    title: 'Document Title',
    subTitle: 'Subtitle',
    description:
      'This is a description of the document. It provides detailed information.',
  },
};

export const CustomExample: Story = {
  args: {
    title: 'Custom Title',
    subTitle: 'Custom Subtitle',
    description:
      'This is a custom description. The content is altered to showcase different text values.',
  },
};
