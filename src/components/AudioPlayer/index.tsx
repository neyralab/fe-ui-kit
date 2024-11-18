import { useEffect, useState } from 'react';
import { MessageType } from '../../types/MessageType';
import { ErrorMessages } from '../../types/ErrorMessages';

interface AudioPlayerProps {
  slug: string;
  apiUrl: string;
  decryptionKey?: string;
  basePath?: string;

  audioRef: React.RefObject<HTMLAudioElement>;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onLoadedMetadata?: (
    event: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => void;
  onCanPlay?: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => void;

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
  basePath = '',
  audioRef,
  onEnded,
  onError,
  onLoadedMetadata,
  onTimeUpdate,
  onCanPlay,
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
        .register(`${basePath}/service-worker.js`)
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
          setError(ErrorMessages.SERVICE_WORKER_REGISTRATION_FAILED);
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
              setError(ErrorMessages.DEFAULT_ERROR);
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
      setError(ErrorMessages.SERVICE_WORKER_UNSUPPORTED);
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
    if (!audioUrl) {
      return;
    }
    setError('An unexpected error occurred while playing the audio.');
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <audio
      src={audioUrl}
      ref={audioRef}
      onEnded={onEnded}
      onError={handleError}
      onLoadedMetadata={onLoadedMetadata}
      onTimeUpdate={onTimeUpdate}
      onCanPlay={onCanPlay}
      controls={controls}
      loop={loop}
      muted={muted}
      autoPlay={autoplay}
      className={className}
    />
  );
};

export default AudioPlayer;
