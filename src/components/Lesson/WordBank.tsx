import {Children, type ReactNode} from 'react';

import styles from './styles.module.css';

type WordBankProps = {
  children: ReactNode;
};

function flattenToString(children: ReactNode): string | null {
  const parts: string[] = [];
  let plain = true;

  Children.forEach(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      parts.push(String(child));
    } else {
      plain = false;
    }
  });

  return plain ? parts.join('') : null;
}

export default function WordBank({children}: WordBankProps) {
  const flat = flattenToString(children);

  if (flat !== null) {
    const items = flat
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    return (
      <div className={styles.wordBank}>
        {items.map((item, index) => (
          <span className={styles.wordBankItem} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  return <div className={styles.wordBank}>{children}</div>;
}
