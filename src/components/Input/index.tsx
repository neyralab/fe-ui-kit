import { useEffect, useState } from 'react';
import CN from 'classnames';
import IconAttach from '../../icons/input/icon-attache';
import IconRecord from '../../icons/input/icon-record';
import IconSend from '../../icons/input/icon-send';
import styles from './styles.module.scss';

const formatSecondsToString = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`;
};

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlerValue: (value: string) => void;
  placeholder?: string;
  inputClass?: string;
  inputRef?: React.RefObject<HTMLInputElement>;

  startRecord?: boolean;
  handleStopRecord?: () => void;

  neyraWrites?: boolean;
  cancelRequestToNeyra?: () => void;
}

const Input = ({
  value,
  onChange,
  handlerValue,
  placeholder,
  inputClass,
  inputRef,
  startRecord,
  handleStopRecord,
  neyraWrites,
  cancelRequestToNeyra,
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<number | 0>(0);
  const [disabledAnimation, setDisabledAnimation] = useState(true);

  useEffect(() => {
    neyraWrites && setDisabledAnimation(false);
  }, [neyraWrites]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setSeconds(0);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (startRecord && !intervalId) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      setIntervalId(interval);
    } else if (!startRecord && intervalId) {
      clearInterval(intervalId);
      setSeconds(0);
      setIntervalId(0);
    }
  }, [startRecord, intervalId]);

  const sendMessage = () => {
    if (neyraWrites && cancelRequestToNeyra) {
      cancelRequestToNeyra();
    }
    value && handlerValue(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const enterKey =
      e.key === 'Enter' || e.keyCode === 13 || e.code === 'NumpadEnter';
    enterKey && sendMessage();
  };

  return (
    <div className={styles.inputWrapper}>
      <div
        className={CN(
          styles.inputComponent,
          isFocus && styles.inputComponentActive,
          inputClass
        )}
      >
        {startRecord ? (
          <p className={styles.seconds}>{formatSecondsToString(seconds)}</p>
        ) : (
          <input
            ref={inputRef}
            placeholder={placeholder}
            className={styles.input}
            onChange={onChange}
            value={value}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              setIsFocus(false);
            }}
            onFocus={() => {
              setIsFocus(true);
            }}
          />
        )}
        <div className={styles.inputActions}>
          <button className={styles.inputAction}>
            <IconAttach />
          </button>
          {startRecord ? (
            <button onClick={handleStopRecord} className={styles.inputAction}>
              <IconRecord />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              className={CN(
                styles.inputAction,
                value && styles.inputActionActive,
                !disabledAnimation &&
                  (neyraWrites
                    ? styles.triangleToSquare
                    : styles.squareToTriangle)
              )}
            >
              <div className={styles.triangle}>
                <IconSend />
              </div>
              <div className={styles.square}></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
