import clsx from 'clsx';
import type {ReactNode} from 'react';

import styles from './styles.module.css';

type TurnProps = {
  speaker?: string;
  children: ReactNode;
};

export default function Turn({speaker, children}: TurnProps) {
  const isAnonymous = !speaker;
  return (
    <div className={clsx(styles.turn, isAnonymous && styles.turnAnonymous)}>
      <div className={styles.turnSpeaker} aria-hidden={isAnonymous}>
        {isAnonymous ? '—' : speaker}
      </div>
      <div className={styles.turnBody}>{children}</div>
    </div>
  );
}
