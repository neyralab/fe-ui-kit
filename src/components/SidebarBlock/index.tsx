import { MouseEvent, ReactNode } from 'react';
import CN from 'classnames';
import styles from './styles.module.scss';

interface SidebarBlockProps {
  icon?: ReactNode;
  text?: string;
  additionalText?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  blockClass?: string;
  iconClass?: string;
  textClass?: string;
  additionalTextClass?: string;
}

const SidebarBlock = ({
  icon,
  text,
  additionalText,
  disabled,
  onClick,
  blockClass,
  iconClass,
  textClass,
  additionalTextClass,
}: SidebarBlockProps) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    !disabled && onClick && onClick(e);
  };
  return (
    <div
      className={CN(styles.sidebar, blockClass, disabled && styles.disabled)}
      onClick={handleClick}
    >
      {icon && <span className={CN(styles.icon, iconClass)}>{icon}</span>}
      {text && <span className={CN(styles.text, textClass)}>{text}</span>}
      {additionalText && (
        <span className={CN(styles.additionalText, additionalTextClass)}>
          {additionalText}
        </span>
      )}
    </div>
  );
};

export default SidebarBlock;
