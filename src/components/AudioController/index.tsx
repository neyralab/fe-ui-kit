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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);

  const handleVolume = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (audioRef.current) {
      const barWidth = event.currentTarget.offsetWidth;
      const clickPosition = event.nativeEvent.offsetX;
      const newVolume = clickPosition / barWidth;
      audioRef.current.volume = newVolume;
      setVolume(newVolume * 100);
    }
  };

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

  return (
    <div className="player_main player_horizontal-reverse">
      <div className="player_progress-section">
        <div
          id="player_current-time"
          className="player_time player_current-time"
        >
          {formatTime(audioRef.current?.currentTime || 0)}
        </div>
        <div className="player_time">/</div>
        <div className="player_time player_total-time">
          {formatTime(audioRef.current?.duration || 0)}
        </div>

        <div
          className="player_progress-container"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          onClick={handleSeek}
        >
          <div className="player_progress-bar">
            <div
              ref={progressBarRef}
              className="player_progress-indicator"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="player_volume-container">
          <button
            type="button"
            className="player_button-clear player_volume-button"
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
            className="player_volume-bar-area"
            onClick={handleVolume}
          >
            <div className="player_volume-bar">
              <div
                className="player_volume-indicator"
                style={{ left: `${volume}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="player_controls-section">
        <div className="player_main-controls">
          <button
            aria-label="Play"
            className="player_button-clear player_main-controls-button player_play-pause-button"
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
