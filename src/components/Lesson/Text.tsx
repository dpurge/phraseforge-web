import clsx from 'clsx';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  ScriptContext,
  getBodyDirection,
  getScriptClassName,
  type Kind,
} from './shared';
import styles from './styles.module.css';

export type TextRole = 'source' | 'transcription' | 'translation';

type TextProps = {
  as?: TextRole;
  lang?: string;
  script?: string;
  system?: string;
  children: ReactNode;
};

export default function Text({
  as = 'source',
  lang,
  script,
  system,
  children,
}: TextProps) {
  const kind: Kind = as === 'source' ? 'text' : as;

  return (
    <Shell kind={kind} lang={lang} script={script} system={system}>
      <ScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(styles.richContent, getScriptClassName(script))}
          dir={getBodyDirection(kind, script)}>
          {children}
        </div>
      </ScriptContext.Provider>
    </Shell>
  );
}
