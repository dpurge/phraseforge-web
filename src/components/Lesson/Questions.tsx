import clsx from 'clsx';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  ScriptContext,
  getBodyDirection,
  getScriptClassName,
  type Kind,
} from './shared';
import type {TextRole} from './Text';
import styles from './styles.module.css';

type QuestionsProps = {
  as?: TextRole;
  lang?: string;
  script?: string;
  system?: string;
  children: ReactNode;
};

export default function Questions({
  as = 'source',
  lang,
  script,
  system,
  children,
}: QuestionsProps) {
  const kind: Kind = as === 'source' ? 'questions' : as;

  return (
    <Shell kind={kind} lang={lang} script={script} system={system}>
      <ScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(
            styles.richContent,
            styles.questions,
            getScriptClassName(script),
          )}
          dir={getBodyDirection(kind, script)}>
          {children}
        </div>
      </ScriptContext.Provider>
    </Shell>
  );
}
