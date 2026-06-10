import clsx from 'clsx';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  LessonScriptContext,
  getBodyDirection,
  getScriptClassName,
} from './shared';
import styles from './styles.module.css';

type TranslationProps = {
  lang?: string;
  script?: string;
  children: ReactNode;
};

export default function Translation({
  lang,
  script,
  children,
}: TranslationProps) {
  return (
    <Shell kind="translation" lang={lang} script={script}>
      <LessonScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(styles.richContent, getScriptClassName(script))}
          dir={getBodyDirection('translation', script)}>
          {children}
        </div>
      </LessonScriptContext.Provider>
    </Shell>
  );
}
