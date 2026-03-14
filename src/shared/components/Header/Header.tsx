import styles from './Header.module.css';
import { NavList } from '../';

// type HeaderProps = {
// };

export function Header(/*{}: HeaderProps*/) {
  return (
    <header className={styles.root}>
      <NavList />
    </header>
  );
}
