import clsx from 'clsx';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  ScriptContext,
  getBodyDirection,
  getScriptClassName,
  type ExerciseType,
} from './shared';
import styles from './styles.module.css';

type ExerciseProps = {
  type: ExerciseType;
  lang?: string;
  script?: string;
  children: ReactNode;
};

export default function Exercise({
  type,
  lang,
  script,
  children,
}: ExerciseProps) {
  return (
    <Shell kind="exercise" type={type} lang={lang} script={script}>
      <ScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(
            styles.richContent,
            styles.exerciseContent,
            getScriptClassName(script),
          )}
          dir={getBodyDirection('exercise', script)}
          data-type={type}>
          {children}
        </div>
      </ScriptContext.Provider>
    </Shell>
  );
}
