import type {ReactNode} from 'react';

import styles from './styles.module.css';

type HintProps = {
  children: ReactNode;
};

export default function Hint({children}: HintProps) {
  return <span className={styles.hint}>{children}</span>;
}
