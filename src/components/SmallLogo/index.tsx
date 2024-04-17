import CN from 'classnames';
import IconSmallLogo from '../../icons/icon-small-logo';
import styles from './styles.module.scss';

interface SmallLogoProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  logoClass?: string;
  disabled?: boolean;
}

const SmallLogo = ({ onClick, disabled, logoClass }: SmallLogoProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={CN(styles.logo, logoClass)}
    >
      <IconSmallLogo />
    </button>
  );
};

export default SmallLogo;
