import clsx from 'clsx';
import type {ReactNode} from 'react';

import styles from './styles.module.css';

type InstructionProps = {
  children: ReactNode;
};

export default function Instruction({children}: InstructionProps) {
  return (
    <p
      className={clsx(styles.paragraph, styles.instruction)}
      dir="ltr">
      {children}
    </p>
  );
}
