import {useHistory, useLocation} from '@docusaurus/router';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useId, type ChangeEvent} from 'react';

import {languageOptions} from '@site/src/languages';
import styles from './styles.module.css';

function getActiveCode(pathname: string, baseUrl: string): string {
  const stripped = pathname.startsWith(baseUrl)
    ? pathname.slice(baseUrl.length)
    : pathname;
  const segment = stripped.replace(/^\/+/, '').split('/')[0] ?? '';
  return languageOptions.some((opt) => opt.code === segment) ? segment : '';
}

export default function LanguagePicker() {
  const {pathname} = useLocation();
  const history = useHistory();
  const baseUrl = useBaseUrl('/');
  const selectId = useId();
  const activeCode = getActiveCode(pathname, baseUrl);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const code = event.target.value;
    if (!code) return;
    const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    history.push(`${prefix}${code}/`);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={selectId} className={styles.label}>
        <Translate
          id="lesson.picker.label"
          description="Label above the language-picker dropdown in the lesson sidebar">
          Język
        </Translate>
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={activeCode}
        onChange={handleChange}>
        {activeCode === '' && (
          <option value="" disabled>
            —
          </option>
        )}
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

