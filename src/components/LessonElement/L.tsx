import clsx from 'clsx';
import {useContext, type ReactNode} from 'react';

import {
  LessonScriptContext,
  getScriptClassName,
  isRtlScript,
} from './shared';
import styles from './styles.module.css';

type LProps = {
  children: ReactNode;
};

export default function L({children}: LProps) {
  const ctx = useContext(LessonScriptContext);
  const script = ctx?.script;

  return (
    <span
      className={clsx(styles.scriptRun, getScriptClassName(script))}
      dir={isRtlScript(script) ? 'rtl' : undefined}>
      {children}
    </span>
  );
}
