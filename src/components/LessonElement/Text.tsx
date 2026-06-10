import clsx from 'clsx';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  LessonScriptContext,
  getBodyDirection,
  getScriptClassName,
} from './shared';
import styles from './styles.module.css';

type TextProps = {
  lang?: string;
  script?: string;
  children: ReactNode;
};

export default function Text({lang, script, children}: TextProps) {
  return (
    <Shell kind="text" lang={lang} script={script}>
      <LessonScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(styles.richContent, getScriptClassName(script))}
          dir={getBodyDirection('text', script)}>
          {children}
        </div>
      </LessonScriptContext.Provider>
    </Shell>
  );
}
