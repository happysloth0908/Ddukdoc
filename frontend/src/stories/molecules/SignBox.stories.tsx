// src/stories/molecules/SignBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SignBox } from '../../components/molecules/SignBox.tsx';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof SignBox> = {
  title: 'Components/Molecules/SignBox',
  component: SignBox,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SignBox>;

export const Default: Story = {
  args: {
    next: '/test',
    role: '채권자',
  },
  render: (args) => (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            width: '390px',
            height: '844px',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <SignBox {...args} />
        </div>
      </div>
    </MemoryRouter>
  ),
};
