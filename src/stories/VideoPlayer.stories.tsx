import { Meta, StoryObj } from '@storybook/react';
import VideoPlayer from '../components/VideoPlayer';

const apiUrl = 'https://api.dev.ghostdrive.com/api';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
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
    playing: {
      control: { type: 'boolean' },
      defaultValue: true,
      description: 'Automatically start playing the video',
    },
    loop: {
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Loop the video playback',
    },
    muted: {
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Mute the video playback',
    },
    controls: {
      control: { type: 'boolean' },
      defaultValue: true,
      description: 'Show playback controls',
    },
    playsinline: {
      control: { type: 'boolean' },
      defaultValue: true,
      description: 'Play video inline on mobile devices',
    },
    width: {
      control: { type: 'text' },
      defaultValue: '100%',
      description: 'Width of the video player',
    },
    height: {
      control: { type: 'text' },
      defaultValue: '100%',
      description: 'Height of the video player',
    },
    onPlay: {
      action: 'played',
    },
    onPause: {
      action: 'paused',
    },
    onEnded: { action: 'ended' },
    onError: {
      action: 'error',
    },
    onReady: {
      action: 'ready to play',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiUrl,
  },
};
