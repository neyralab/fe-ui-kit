import { useEffect, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { MessageType } from '../../types/MessageType';
import { OnProgressProps } from 'react-player/base';

interface VideoPlayerProps {
  slug: string;
  decryptionKey?: string;
  apiUrl: string;

  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsinline?: boolean;
  width?: string | number;
  height?: string | number;
  videoRef?: React.Ref<ReactPlayer>;

  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onReady?: (player: ReactPlayer) => void;
  onProgress?: (state: OnProgressProps) => void;

  className?: string;
  playerProps?: ReactPlayerProps;
}

const generateVideoUrl = (slug: string, decryptionKey?: string): string => {
  const baseUrl = 'non-existent-url/video.mp4';
  const queryParams = new URLSearchParams({
    slug: slug,
    key: decryptionKey || '',
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

let cacheCleared = false;

const VideoPlayer = ({
  slug,
  decryptionKey,
  apiUrl,
  playing = true,
  loop = false,
  muted = false,
  controls = true,
  playsinline = true,
  width = '100%',
  height = '100%',
  onPlay,
  onPause,
  onEnded,
  onError,
  onReady,
  onProgress,
  className = '',
  videoRef,
  playerProps = {},
}: VideoPlayerProps) => {
  const [error, setError] = useState<string>('');
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [apiUrlSaved, setApiUrlSaved] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js')
        .then((registration) => {
          if (registration.active) {
            setServiceWorkerReady(true);
          } else {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    setServiceWorkerReady(true);
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          setError('Service Worker registration failed');
        });

      const handleMessage = (event: MessageEvent) => {
        const { data } = event;
        if (data) {
          switch (data.type) {
            case MessageType.VIDEO_ERROR:
              setError(data.message);
              break;
            case MessageType.API_URL_SAVED:
              setApiUrlSaved(true);
              break;
            case MessageType.API_URL_SAVE_FAILED:
              console.log('Failed to save API URL:', data.message);
              setError('An unexpected error occurred while playing the video.');
              break;
            case MessageType.CACHE_CLEARED:
              cacheCleared = true;
              console.log('Cache has been cleared.');
              break;
            default:
              break;
          }
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    } else {
      setError('Service Workers are not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    if (serviceWorkerReady) {
      if (!apiUrl) {
        setError('Backend url are required.');
        return;
      }

      !cacheCleared &&
        navigator.serviceWorker.controller?.postMessage({
          type: 'DELETE_EXPIRED_CACHE',
        });
      navigator.serviceWorker.controller?.postMessage({ apiUrl });
    }
  }, [apiUrl, serviceWorkerReady]);

  useEffect(() => {
    if (serviceWorkerReady && apiUrlSaved) {
      if (!slug) {
        setError('Slug is required.');
        return;
      }
      const newVideoUrl = generateVideoUrl(slug, decryptionKey);
      setVideoUrl(newVideoUrl);
      setError('');
    }
  }, [slug, decryptionKey, serviceWorkerReady, apiUrlSaved]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error]);

  const handleError = () => {
    if (!videoUrl) {
      return;
    }
    setError('An unexpected error occurred while playing the video.');
  };

  return (
    <ReactPlayer
      ref={videoRef}
      url={videoUrl}
      playing={playing}
      loop={loop}
      muted={muted}
      controls={controls}
      playsinline={playsinline}
      width={width}
      height={height}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
      onError={handleError}
      onReady={onReady}
      onProgress={onProgress}
      className={className}
      {...playerProps}
    />
  );
};

export default VideoPlayer;
