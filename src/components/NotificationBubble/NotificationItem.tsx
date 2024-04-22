import { useLayoutEffect } from 'react';
import cn from 'classnames';
import IconAlert from '../../icons/notification/icon-alert';
import IconWarning from '../../icons/notification/icon-warning';
import IconSuccess from '../../icons/notification/icon-success';
import IconNotification from '../../icons/notification/icon-notification';
import IconClose from '../../icons/notification/icon-close';
import { NotificationType } from '../../types';

const DEFAULT_DURATION = 5000;

const NOTIFICATION_ICON = {
  alert: IconAlert,
  warning: IconWarning,
  success: IconSuccess,
  default: IconNotification,
};

interface NotificationItemProps {
  notification: NotificationType;
  removeItem: (notification: NotificationType) => void;
}

const NotificationItem = ({
  notification,
  removeItem,
}: NotificationItemProps) => {
  const {
    message,
    showButtons,
    acceptMessage,
    acceptHandler,
    cancelMessage,
    cancelHandler,
    hideIcon,
    type,
    width,
    merged,
  } = notification;

  const Icon =
    type && Object.prototype.hasOwnProperty.call(NOTIFICATION_ICON, type)
      ? NOTIFICATION_ICON[type]
      : NOTIFICATION_ICON.default;

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      removeItem(notification);
    }, DEFAULT_DURATION);

    return () => clearTimeout(timer);
  });

  const closeNotification = () => {
    removeItem(notification);
  };

  return (
    <div
      className="notifications-item"
      style={{ width }}
      data-test={`toster_container`}
    >
      <div
        className={cn('notifications-item-icon', type, {
          ['notifications-item-merged']: merged,
        })}
      >
        {!hideIcon && <Icon />}
      </div>
      <div
        className={cn('notifications-item-message', {
          ['notifications-item-merged']: merged,
        })}
        data-test={`toster_message`}
      >
        {message}
      </div>
      {showButtons && acceptMessage && (
        <button
          className="link link--shrink notifications-accept"
          onClick={acceptHandler}
          data-test={`toster_accept_message_button`}
        >
          {acceptMessage}
        </button>
      )}
      {showButtons && cancelMessage && (
        <button
          className="link link--shrink notifications-cancel"
          onClick={cancelHandler}
          data-test={`toster_cancel_message_button`}
        >
          {cancelMessage}
        </button>
      )}
      <button
        type="button"
        className="notifications-close"
        onClick={closeNotification}
        data-test={`toster_close_button`}
      >
        <IconClose />
      </button>
    </div>
  );
};

export default NotificationItem;
