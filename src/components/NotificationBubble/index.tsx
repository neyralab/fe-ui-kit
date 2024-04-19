import { TransitionGroup, CSSTransition } from 'react-transition-group';
import NotificationItem from './NotificationItem';
import { NotificationType } from '../../types';

import './styles.scss';

interface NotificationBubbleProps {
  notifications: NotificationType[];
  removeNotification: (notification: NotificationType) => void;
}

const NotificationBubble = ({
  notifications,
  removeNotification,
}: NotificationBubbleProps) => {
  const removeItem = (notification: NotificationType) => {
    removeNotification(notification);
  };

  const notificationItems = notifications.map((notification) => (
    <CSSTransition
      key={`notification-item-${notification.id}`}
      classNames="notification-item"
      timeout={0}
    >
      <NotificationItem notification={notification} removeItem={removeItem} />
    </CSSTransition>
  ));

  return (
    <TransitionGroup className="notifications-container">
      {notificationItems}
    </TransitionGroup>
  );
};

export default NotificationBubble;
