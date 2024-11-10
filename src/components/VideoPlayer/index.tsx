import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

interface VideoPlayerProps {
  slug: string;
  decryptionKey?: string;
  apiUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onReadyToPlay?: () => void;
  className?: string;
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

enum MessageType {
  VIDEO_ERROR = 'VIDEO_ERROR',
  API_URL_SAVED = 'API_URL_SAVED',
  API_URL_SAVE_FAILED = 'API_URL_SAVE_FAILED',
  CACHE_CLEARED = 'CACHE_CLEARED',
}

const VideoPlayer = ({
  slug,
  decryptionKey,
  apiUrl,
  autoplay = true,
  loop = false,
  muted = false,
  controls = true,
  onPlay,
  onPause,
  onEnd,
  onError,
  onReadyToPlay,
  className = '',
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
        setError('Slug are required.');
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

  const handleLoadedData = () => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error(error);
      });
    }
    onReadyToPlay?.();
  };

  const handlePlay = () => {
    onPlay?.();
  };

  const handlePause = () => {
    onPause?.();
  };

  const handleEnd = () => {
    onEnd?.();
  };

  const handleError = async () => {
    if (!videoUrl) {
      return;
    }
    setError('An unexpected error occurred while playing the video.');
  };

  return (
    <div className={`${styles.videoContainer} ${className}`}>
      {error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          loop={loop}
          controls={controls}
          muted={muted}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnd}
          onError={handleError}
          onLoadedData={handleLoadedData}
          className={styles.video}
        >
          <p>Your browser does not support the video tag.</p>
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
