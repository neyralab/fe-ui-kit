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
}

const generateVideoUrl = (slug: string, decryptionKey?: string): string => {
  const baseUrl = 'non-existent-url/video.mp4';
  const queryParams = new URLSearchParams({
    slug: slug,
    key: decryptionKey || '',
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

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
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string>('');
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

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
    }
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VIDEO_ERROR') {
        setError(event.data.message);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (serviceWorkerReady) {
      if (!apiUrl) {
        setError('Backend url are required.');
        return;
      }

      navigator.serviceWorker.controller?.postMessage({
        type: 'DELETE_EXPIRED_CACHE',
      });
      navigator.serviceWorker.controller?.postMessage({ apiUrl });
    }
  }, [apiUrl, serviceWorkerReady]);

  useEffect(() => {
    if (serviceWorkerReady) {
      if (!slug) {
        setError('Slug are required.');
        return;
      }
      const newVideoUrl = generateVideoUrl(slug, decryptionKey);
      setVideoUrl(newVideoUrl);
      setError('');
    }
  }, [slug, decryptionKey, serviceWorkerReady]);

  useEffect(() => {
    onError?.(error);
  }, [error]);

  const handleLoadedData = () => {
    if (autoplay && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error(error);
      });
    }
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
    setError('An unexpected error occurred while playing the video.');
  };

  return (
    <div className={styles.videoContainer}>
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
