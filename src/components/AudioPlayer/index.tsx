import { useEffect, useState } from 'react';
import { MessageType } from '../../types/MessageType';

interface AudioPlayerProps {
  slug: string;
  apiUrl: string;
  decryptionKey?: string;

  audioRef: React.RefObject<HTMLAudioElement>;
  onFinish?: () => void;
  onError?: (error: string) => void;
  onLoadedMetadata?: (
    event: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => void;

  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;

  className?: string;
}

const generateAudioUrl = (slug: string, decryptionKey?: string): string => {
  const baseUrl = 'non-existent-url/audio.mp3';
  const queryParams = new URLSearchParams({
    slug: slug,
    key: decryptionKey || '',
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

let cacheCleared = false;

const AudioPlayer = ({
  slug,
  decryptionKey,
  apiUrl,
  audioRef,
  onFinish,
  onError,
  onLoadedMetadata,
  onTimeUpdate,
  controls = false,
  loop = false,
  muted = false,
  autoplay = false,
  className = '',
}: AudioPlayerProps) => {
  const [error, setError] = useState<string>('');
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
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
            case MessageType.AUDIO_ERROR:
              setError(data.message);
              break;
            case MessageType.API_URL_SAVED:
              setApiUrlSaved(true);
              break;
            case MessageType.API_URL_SAVE_FAILED:
              console.log('Failed to save API URL:', data.message);
              setError('An unexpected error occurred while playing the audio.');
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
        setError('Backend URL is required.');
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
      const newAudioUrl = generateAudioUrl(slug, decryptionKey);
      setAudioUrl(newAudioUrl);
      setError('');
    }
  }, [slug, decryptionKey, serviceWorkerReady, apiUrlSaved]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error]);

  const handleError = () => {
    setError('An unexpected error occurred while playing the audio.');
  };

  return (
    <audio
      src={audioUrl}
      ref={audioRef}
      onEnded={onFinish}
      onError={handleError}
      onLoadedMetadata={onLoadedMetadata}
      onTimeUpdate={onTimeUpdate}
      controls={controls}
      loop={loop}
      muted={muted}
      autoPlay={autoplay}
      className={className}
    />
  );
};

export default AudioPlayer;
