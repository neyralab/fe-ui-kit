import IconDelete from '../../icons/icon-delete';
import styles from './styles.module.scss';

interface ChatBlockProps {
  uid: string;
  title: string;
  handleClick: (uid: string) => void;
  handleIconClick?: (uid: string) => void;
}

const ChatBlock = ({
  uid,
  title,
  handleClick,
  handleIconClick,
}: ChatBlockProps) => {
  return (
    <div
      className={styles.chatBlock}
      onClick={() => {
        handleClick(uid);
      }}
    >
      <div className={styles.blockContainer}>
        <div className={styles.chatCircleIcon} />
        <span className={styles.title}>{title}</span>
      </div>
      <div
        onClick={() => {
          handleIconClick && handleIconClick(uid);
        }}
      >
        <IconDelete />
      </div>
    </div>
  );
};

export default ChatBlock;
