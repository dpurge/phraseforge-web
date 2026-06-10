import type {ReactNode} from 'react';

import Shell from './Shell';
import styles from './styles.module.css';

type TranscriptionProps = {
  lang?: string;
  script?: string;
  system?: string;
  children: ReactNode;
};

export default function Transcription({
  lang,
  script,
  system,
  children,
}: TranscriptionProps) {
  return (
    <Shell kind="transcription" lang={lang} script={script} system={system}>
      <div className={styles.richContent} dir="ltr">
        {children}
      </div>
    </Shell>
  );
}
