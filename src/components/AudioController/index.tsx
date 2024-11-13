import { useEffect, useRef, useState } from 'react';
import {
  MutedVolumeIcon,
  PauseIcon,
  PlayIcon,
  UnmutedVolumeIcon,
} from './icons';
import './styles.css';

interface AudioControllerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioController: React.FC<AudioControllerProps> = ({ audioRef }) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteUnmute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (audioRef.current) {
      const progressContainer = e.currentTarget;
      const seekTime =
        (e.nativeEvent.offsetX / progressContainer.offsetWidth) *
        audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio && progressBarRef.current) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
        setProgress(progress);
      }
    };

    const handleAudioEnd = () => {
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };

    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleAudioEnd);
      }
    };
  }, [audioRef.current]);

  const getVolumeFromPosition = (position: number): number => {
    if (volumeBarRef.current) {
      const barRect = volumeBarRef.current.getBoundingClientRect();
      const relativePos = Math.min(
        Math.max(position - barRect.left, 0),
        barRect.width
      );
      return (relativePos / barRect.width) * 100;
    }
    return 0;
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    const newVolume = getVolumeFromPosition(e.clientX);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }

    const handleMouseMove = (e: MouseEvent): void => {
      const updatedVolume = getVolumeFromPosition(e.clientX);
      setVolume(updatedVolume);
      if (audioRef.current) {
        audioRef.current.volume = updatedVolume / 100;
      }
    };

    const handleMouseUp = (): void => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="rhap_main rhap_horizontal-reverse">
      <div className="rhap_progress-section">
        <div id="rhap_current-time" className="rhap_time rhap_current-time">
          {formatTime(audioRef.current?.currentTime || 0)}
        </div>
        <div className="rhap_time">/</div>
        <div className="rhap_time rhap_total-time">
          {formatTime(audioRef.current?.duration || 0)}
        </div>

        <div
          className="rhap_progress-container"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          onClick={handleSeek}
        >
          <div className="rhap_progress-bar">
            <div
              ref={progressBarRef}
              className="rhap_progress-indicator"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="rhap_volume-container">
          <button
            type="button"
            className="rhap_button-clear rhap_volume-button"
            onClick={handleMuteUnmute}
          >
            {isMuted ? <MutedVolumeIcon /> : <UnmutedVolumeIcon />}
          </button>
          <div
            role="progressbar"
            aria-label="Volume control"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volume}
            tabIndex={0}
            className="rhap_volume-bar-area"
            onMouseDown={handleMouseDown}
            ref={volumeBarRef}
          >
            <div className="rhap_volume-bar">
              <div
                className="rhap_volume-indicator"
                style={{ left: `${volume}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rhap_controls-section">
        <div className="rhap_main-controls">
          <button
            aria-label="Play"
            className="rhap_button-clear rhap_main-controls-button rhap_play-pause-button"
            type="button"
            onClick={handlePlayPause}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioController;
