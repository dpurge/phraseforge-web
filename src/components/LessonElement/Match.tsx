import type {ReactNode} from 'react';

import styles from './styles.module.css';

type MatchProps = {
  children: ReactNode;
};

export default function Match({children}: MatchProps) {
  return <div className={styles.match}>{children}</div>;
}
