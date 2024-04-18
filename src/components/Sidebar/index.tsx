import CN from 'classnames';
import styles from './styles.module.scss';

interface SidebarProps {
  children: React.ReactNode;
  open?: boolean;
  sidebarClass?: string;
}

const Sidebar = ({ children, open = true, sidebarClass }: SidebarProps) => {
  return (
    <div
      className={CN(styles.sidebar, !open && styles.hideSidebar, sidebarClass)}
    >
      {children}
    </div>
  );
};

export default Sidebar;
