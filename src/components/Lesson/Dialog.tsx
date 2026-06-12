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

type DialogProps = {
  as?: TextRole;
  lang?: string;
  script?: string;
  system?: string;
  title?: string;
  children: ReactNode;
};

export default function Dialog({
  as = 'source',
  lang,
  script,
  system,
  title,
  children,
}: DialogProps) {
  const kind: Kind = as === 'source' ? 'dialog' : as;

  return (
    <Shell kind={kind} lang={lang} script={script} system={system}>
      <ScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(
            styles.richContent,
            styles.dialog,
            getScriptClassName(script),
          )}
          dir={getBodyDirection(kind, script)}>
          {title && <h3 className={styles.dialogTitle}>{title}</h3>}
          {children}
        </div>
      </ScriptContext.Provider>
    </Shell>
  );
}
