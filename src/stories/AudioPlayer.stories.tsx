import { Meta, StoryObj } from '@storybook/react';
import AudioPlayer from '../components/AudioPlayer';

const apiUrl = 'https://api.dev.ghostdrive.com/api';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/AudioPlayer',
  component: AudioPlayer,
  decorators: [
    (Story) => (
      <div
        style={{
          width: '900px',
          height: '500px',
          overflow: 'hidden',
          border: '2px solid #ccc',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onFinish: { action: 'finished' },
    onError: { action: 'error' },
    onLoadedMetadata: { action: 'metadata loaded' },
    onTimeUpdate: { action: 'time updated' },
    controls: { control: 'boolean' },
    loop: { control: 'boolean' },
    muted: { control: 'boolean' },
    autoplay: { control: 'boolean' },
    className: { control: 'text' },
    slug: { control: 'text' },
    apiUrl: { control: 'text' },
    decryptionKey: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiUrl,
  },
};
