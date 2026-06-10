import clsx from 'clsx';
import {useContext, type ReactNode} from 'react';

import {
  LessonScriptContext,
  getBodyDirection,
  getScriptClassName,
  isLargeScript,
} from './shared';
import styles from './styles.module.css';

type ColumnProps = {
  lang?: string;
  script?: string;
  children: ReactNode;
};

export default function Column({lang, script, children}: ColumnProps) {
  const parent = useContext(LessonScriptContext);
  const overridden = script !== undefined || lang !== undefined;
  const effectiveLang = overridden ? lang : parent?.lang;
  const effectiveScript = overridden ? script : parent?.script;

  const className = clsx(
    styles.column,
    script !== undefined && !isLargeScript(script) && styles.columnReset,
    script !== undefined && getScriptClassName(script),
  );
  const dir =
    script !== undefined ? getBodyDirection('text', script) : undefined;

  return (
    <LessonScriptContext.Provider
      value={{lang: effectiveLang, script: effectiveScript}}>
      <div className={className} dir={dir}>
        {children}
      </div>
    </LessonScriptContext.Provider>
  );
}
