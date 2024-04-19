import { ReactNode } from 'react';
import IconSuccess from '../../icons/icon-success';
import styles from './styles.module.scss';

export interface BorderNotificationProps {
  icon?: ReactNode;
  text: string;
}

const BorderNotification = ({ icon, text }: BorderNotificationProps) => {
  return (
    <div className={styles.notification}>
      <div>{icon || <IconSuccess />}</div>
      <div className={styles.notificationType}>
        <p className={styles.notificationText}>
          {text} <span className={styles.blinkingPipe}>|</span>
        </p>
      </div>
    </div>
  );
};

export default BorderNotification;
