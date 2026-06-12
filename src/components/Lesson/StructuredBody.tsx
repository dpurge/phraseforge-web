import clsx from 'clsx';

import {getScriptClassName, getSourceDirection} from './shared';
import styles from './styles.module.css';

type StructuredBodyProps = {
  content: string;
  script?: string;
};

type StructuredEntry = {
  source: string;
  grammar?: string;
  transcription?: string;
  translation?: string;
};

type StructuredLineParts = {
  left: string;
  translation?: string;
};

const structuredSeparatorPattern = /\s=\s|=/;

function splitStructuredLine(line: string): StructuredLineParts {
  const separatorMatch = structuredSeparatorPattern.exec(line);

  if (!separatorMatch || separatorMatch.index === undefined) {
    return {
      left: line.trim().replace(/=+$/g, '').trim(),
    };
  }

  const left = line
    .slice(0, separatorMatch.index)
    .trim()
    .replace(/=+$/g, '')
    .trim();
  const translation = line
    .slice(separatorMatch.index + separatorMatch[0].length)
    .trim()
    .replace(/^=+/g, '')
    .trim();

  return {
    left,
    translation: translation || undefined,
  };
}

function parseStructuredEntry(line: string): StructuredEntry {
  const {left, translation} = splitStructuredLine(line);
  let source = left;

  const grammarMatch = /\{([^{}]+)\}/.exec(source);
  const grammar = grammarMatch?.[1]?.trim();
  if (grammarMatch) {
    source = source.replace(grammarMatch[0], ' ');
  }

  const transcriptionMatches = [...source.matchAll(/\[([^\]]+)\]/g)];
  const transcriptionMatch =
    transcriptionMatches[transcriptionMatches.length - 1];
  const transcription = transcriptionMatch?.[1]?.trim();
  if (transcriptionMatch && transcriptionMatch.index !== undefined) {
    source = `${source.slice(0, transcriptionMatch.index)}${source.slice(
      transcriptionMatch.index + transcriptionMatch[0].length,
    )}`;
  }

  source = source.replace(/\s+/g, ' ').trim();

  return {
    source: source || left,
    grammar,
    transcription,
    translation,
  };
}

export default function StructuredBody({content, script}: StructuredBodyProps) {
  const sourceDirection = getSourceDirection(script);
  const sourceClassName = clsx(styles.source, getScriptClassName(script));
  const entries = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseStructuredEntry);

  return (
    <div className={styles.entryList}>
      {entries.map((entry, index) => (
        <article className={styles.entry} key={`${entry.source}-${index}`}>
          <div className={styles.entryTerm}>
            <span className={sourceClassName} dir={sourceDirection}>
              {entry.source}
            </span>
            {(entry.grammar || entry.transcription) && (
              <span className={styles.entryMeta}>
                {entry.grammar && (
                  <span className={styles.grammar}>{entry.grammar}</span>
                )}
                {entry.transcription && (
                  <span className={styles.transcription}>
                    {entry.transcription}
                  </span>
                )}
              </span>
            )}
          </div>
          {entry.translation && (
            <div className={styles.translation}>{entry.translation}</div>
          )}
        </article>
      ))}
    </div>
  );
}
