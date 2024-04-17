import CN from 'classnames';
import Notification, { NotificationProps } from '../Notification';
import styles from './styles.module.scss';

interface BorderProps {
  children: React.ReactNode;
  showCircles?: boolean;
  notification?: NotificationProps;
  containerClass?: string;
  contentClass?: string;
  footerClass?: string;
  footerNavigate?: React.ReactNode[];
  footerActions?: React.ReactNode[];
}

const circles = Array.from({ length: 4 }, (_, index) => index + 1);

const Border = ({
  children,
  showCircles = true,
  notification,
  containerClass,
  contentClass,
  footerClass,
  footerNavigate = [],
  footerActions = [],
}: BorderProps) => {
  return (
    <div className={CN(styles.container, containerClass)}>
      <div className={CN(styles.content, contentClass)}>
        {showCircles &&
          circles.map((circle) => (
            <div
              key={circle}
              className={`${styles.cube} ${styles[`circle${circle}`]}`}
            >
              <div className={`${styles.circle}`}></div>
            </div>
          ))}
        {children}
      </div>
      <footer className={CN(styles.footer, footerClass)}>
        <div className={styles.footerNavigate}>
          {footerNavigate.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
        {notification?.text && <Notification {...notification} />}
        <div className={styles.footerActions}>
          {footerActions.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Border;
