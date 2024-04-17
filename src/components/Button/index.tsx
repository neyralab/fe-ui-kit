import { ReactNode } from 'react';
import CN from 'classnames';
import styles from './styles.module.scss';

interface ButtonProps {
  variant?: 'outlined';
  type?: 'default' | 'error' | 'active' | 'warning';
  disabled?: boolean;
  icon?: ReactNode;
  text?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonClass?: string;
  textClass?: string;
}

const Button = ({
  variant = 'outlined',
  type = 'default',
  disabled = false,
  icon,
  text,
  onClick,
  buttonClass,
  textClass,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={CN(styles.button, styles[variant], styles[type], buttonClass)}
    >
      {icon && <>{icon}</>}
      {text && <span className={CN(styles.text, textClass)}>{text}</span>}
    </button>
  );
};

export default Button;
