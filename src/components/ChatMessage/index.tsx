import { useEffect, useState } from 'react';
import CN from 'classnames';
import IconCircle from '../../icons/chat-message/icon-circle';
import IconPlus from '../../icons/chat-message/icon-plus';
import IconTriangle from '../../icons/chat-message/icon-triangle';
import styles from './styles.module.scss';

interface ChatMessageType {
  id: string;
  text: string;
  voice: boolean;
  timeStamp: string;
  isNeyro: boolean;
  blob?: string;
  response?: string;
}

type ButtonShape = 'circle' | 'plus' | 'triangle';

interface ChatMessageProps {
  message: ChatMessageType;
  handleTriangle: () => void;
  handleOnPage: () => void;
  handleCopyText: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabledButtons?: ButtonShape[];
  messageClass?: string;
  WafeSurferComponent: any;
}

const ChatMessage = ({
  message,
  handleTriangle,
  handleOnPage,
  handleCopyText,
  disabledButtons,
  messageClass,
  WafeSurferComponent,
}: ChatMessageProps) => {
  const [isCopy, setIsCopy] = useState(false);
  const { id, isNeyro, text, timeStamp, voice, blob } = message;

  useEffect(() => {
    if (isCopy) {
      const timer = setTimeout(() => {
        setIsCopy(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isCopy]);

  const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsCopy(true);
    navigator.clipboard.writeText(text);
    handleCopyText(e);
  };

  return (
    <div
      id={id}
      className={CN(
        styles.wrapper,
        !isNeyro && styles.userMessage,
        messageClass
      )}
    >
      <div
        className={`${styles.messageContainer} ${
          voice && blob ? styles.wafeSurfer : ''
        }`}
      >
        <div>
          {voice && blob ? (
            WafeSurferComponent
          ) : (
            <p className={styles.text}>{text}</p>
          )}
        </div>
        <div className={styles.footer}>
          <div>
            {isNeyro && (
              <div className={styles.blockButtons}>
                <button
                  className={styles.button}
                  onClick={handleTriangle}
                  disabled={disabledButtons?.includes('triangle')}
                >
                  <IconTriangle />
                </button>
                <button
                  onClick={handleOnPage}
                  className={styles.button}
                  disabled={disabledButtons?.includes('plus')}
                >
                  <IconPlus />
                </button>
                <button
                  className={styles.button}
                  onClick={onCopy}
                  disabled={disabledButtons?.includes('circle')}
                >
                  <IconCircle
                    className={CN(
                      styles.copyIcon,
                      isCopy && styles.copyIconActive
                    )}
                  />
                </button>
              </div>
            )}
          </div>
          <div className={styles.timeStamp}>{timeStamp}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
