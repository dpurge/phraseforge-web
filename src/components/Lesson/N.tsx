import type {ReactNode} from 'react';

import styles from './styles.module.css';

type NProps = {
  children: ReactNode;
};

export default function N({children}: NProps) {
  return (
    <span className={styles.native} dir="ltr">
      {children}
    </span>
  );
}
