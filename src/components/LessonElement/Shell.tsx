import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useId, useState, type ReactNode} from 'react';

import {
  getLocaleFamily,
  labels,
  toggleLabels,
  typeLabels,
  type ExerciseType,
  type LessonKind,
} from './shared';
import styles from './styles.module.css';

type ShellProps = {
  kind: LessonKind;
  lang?: string;
  script?: string;
  system?: string;
  type?: ExerciseType;
  children: ReactNode;
};

export default function Shell({
  kind,
  lang,
  script,
  system,
  type,
  children,
}: ShellProps) {
  const {i18n} = useDocusaurusContext();
  const localeFamily = getLocaleFamily(i18n.currentLocale);
  const [isExpanded, setIsExpanded] = useState(true);
  const bodyId = useId();
  const label = labels[localeFamily][kind] ?? kind;
  const toggleLabel = isExpanded
    ? toggleLabels[localeFamily].collapse
    : toggleLabels[localeFamily].expand;
  const typeBadge = type ? typeLabels[localeFamily][type] : undefined;
  const metadata = [typeBadge, lang, script, system].filter(Boolean);

  return (
    <section
      className={clsx(
        styles.lessonElement,
        styles[`kind_${kind}`],
        !isExpanded && styles.lessonElementCollapsed,
      )}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{label}</h2>
          {metadata.length > 0 && (
            <div className={styles.metadata}>
              {metadata.map((item) => (
                <span className={styles.metaBadge} key={item}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.toggleButton}
          aria-controls={bodyId}
          aria-expanded={isExpanded}
          aria-label={`${toggleLabel}: ${label}`}
          onClick={() => setIsExpanded((current) => !current)}>
          <span className={styles.toggleIcon} aria-hidden="true" />
        </button>
      </header>
      {isExpanded && (
        <div className={styles.body} id={bodyId}>
          {children}
        </div>
      )}
    </section>
  );
}
