import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {ReactNode} from 'react';

import Shell from './Shell';
import {
  ScriptContext,
  getBodyDirection,
  getLocaleFamily,
  getScriptClassName,
  inflectionTypeLabels,
  type InflectionType,
} from './shared';
import styles from './styles.module.css';

type InflectionProps = {
  type: InflectionType;
  lang?: string;
  script?: string;
  children: ReactNode;
};

export default function Inflection({
  type,
  lang,
  script,
  children,
}: InflectionProps) {
  const {i18n} = useDocusaurusContext();
  const localeFamily = getLocaleFamily(i18n.currentLocale);
  const typeLabel = inflectionTypeLabels[localeFamily][type];

  return (
    <Shell
      kind="inflection"
      lang={lang}
      script={script}
      typeLabel={typeLabel}>
      <ScriptContext.Provider value={{lang, script}}>
        <div
          className={clsx(
            styles.richContent,
            styles.inflection,
            getScriptClassName(script),
          )}
          dir={getBodyDirection('inflection', script)}
          data-type={type}>
          {children}
        </div>
      </ScriptContext.Provider>
    </Shell>
  );
}
