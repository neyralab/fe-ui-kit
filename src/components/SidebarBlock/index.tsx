import { MouseEvent, ReactNode } from 'react';
import CN from 'classnames';
import styles from './styles.module.scss';

interface SidebarBlockProps {
  icon?: ReactNode;
  text?: string;
  additionalText?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onIconClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onAdditionalTextClick?: (e: MouseEvent<HTMLDivElement>) => void;
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
  onIconClick,
  onAdditionalTextClick,
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
      {icon && (
        <span className={CN(styles.icon, iconClass)} onClick={onIconClick}>
          {icon}
        </span>
      )}
      {text && <span className={CN(styles.text, textClass)}>{text}</span>}
      {additionalText && (
        <div
          className={CN(styles.additionalText, additionalTextClass)}
          onClick={onAdditionalTextClick}
        >
          {additionalText}
        </div>
      )}
    </div>
  );
};

export default SidebarBlock;
