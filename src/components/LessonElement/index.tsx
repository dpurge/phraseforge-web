import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Fragment, useId, useState, type ReactNode} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './styles.module.css';

type LessonKind =
  | 'text'
  | 'transcription'
  | 'translation'
  | 'vocabulary'
  | 'models'
  | 'exercise';

type LessonElementProps = {
  kind: LessonKind;
  content: string;
  lang?: string;
  script?: string;
  system?: string;
};

type RichBlock =
  | {
      type: 'paragraph';
      lines: string[];
    }
  | {
      type: 'ul' | 'ol' | 'alpha';
      items: string[];
    };

type ExerciseListType = 'ul' | 'ol' | 'alpha';

type ExerciseBlock =
  | {
      type: 'paragraph';
      lines: string[];
    }
  | {
      type: 'list';
      list: ExerciseList;
    };

type ExerciseList = {
  type: ExerciseListType;
  items: ExerciseListItem[];
};

type ExerciseListItem = {
  text: string;
  children: ExerciseList[];
};

type ExerciseListFrame = {
  indent: number;
  list: ExerciseList;
  lastItem?: ExerciseListItem;
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

type ScriptRun = {
  text: string;
  script?: ScriptCode;
};

type ScriptCode =
  | 'latn'
  | 'cyrl'
  | 'grek'
  | 'arab'
  | 'hans'
  | 'hant'
  | 'hebr'
  | 'kore'
  | 'jpan'
  | 'armn'
  | 'geor'
  | 'syrc'
  | 'mong';

type DetectedLargeScript = Exclude<
  ScriptCode,
  'latn' | 'cyrl' | 'grek' | 'hant'
>;

const labels: Record<'en' | 'pl', Record<LessonKind, string>> = {
  en: {
    text: 'Text',
    transcription: 'Transcription',
    translation: 'Translation',
    vocabulary: 'Vocabulary',
    models: 'Models',
    exercise: 'Exercise',
  },
  pl: {
    text: 'Tekst',
    transcription: 'Transkrypcja',
    translation: 'Tłumaczenie',
    vocabulary: 'Słownictwo',
    models: 'Modele',
    exercise: 'Ćwiczenie',
  },
};

const toggleLabels: Record<
  'en' | 'pl',
  {
    collapse: string;
    expand: string;
  }
> = {
  en: {
    collapse: 'Collapse section',
    expand: 'Expand section',
  },
  pl: {
    collapse: 'Zwiń sekcję',
    expand: 'Rozwiń sekcję',
  },
};

const supportedScripts = new Set<ScriptCode>([
  'latn',
  'cyrl',
  'grek',
  'arab',
  'hans',
  'hant',
  'hebr',
  'kore',
  'jpan',
  'armn',
  'geor',
  'syrc',
  'mong',
]);
const normalSizeScripts = new Set<ScriptCode>(['latn', 'cyrl', 'grek']);
const rtlScripts = new Set<ScriptCode>(['arab', 'hebr', 'syrc']);
const verticalScripts = new Set<ScriptCode>(['mong']);
const letterOrNumberPattern = /[\p{L}\p{N}]/u;
const strongTextPattern = /(\*\*[^*]+\*\*)/g;
// const unorderedListPattern = /^\s*[*-]\s+(.*)$/;
// const orderedListPattern = /^\s*\d+\.\s+(.*)$/;
// const alphaListPattern = /^\s*[a-z]\.\s+(.*)$/i;
const exerciseListPattern = /^(\s*)([*-]|\d+\.|[a-z]\.)\s+(.*)$/i;
const structuredSeparatorPattern = /\s=\s|=/;

const largeScriptRanges: Array<{
  script: DetectedLargeScript;
  ranges: Array<[number, number]>;
}> = [
  {
    script: 'arab',
    ranges: [
      [0x0600, 0x06ff],
      [0x0750, 0x077f],
      [0x08a0, 0x08ff],
      [0xfb50, 0xfdff],
      [0xfe70, 0xfeff],
      [0x1ee00, 0x1eeff],
    ],
  },
  {
    script: 'hebr',
    ranges: [
      [0x0590, 0x05ff],
      [0xfb1d, 0xfb4f],
    ],
  },
  {
    script: 'syrc',
    ranges: [
      [0x0700, 0x074f],
      [0x0860, 0x086f],
    ],
  },
  {
    script: 'hans',
    ranges: [
      [0x3400, 0x4dbf],
      [0x4e00, 0x9fff],
      [0xf900, 0xfaff],
      [0x20000, 0x2a6df],
      [0x2a700, 0x2ebef],
      [0x30000, 0x3134f],
    ],
  },
  {
    script: 'jpan',
    ranges: [
      [0x3040, 0x30ff],
      [0x31f0, 0x31ff],
    ],
  },
  {
    script: 'kore',
    ranges: [
      [0x1100, 0x11ff],
      [0x3130, 0x318f],
      [0xa960, 0xa97f],
      [0xac00, 0xd7ff],
    ],
  },
  {
    script: 'armn',
    ranges: [[0x0530, 0x058f]],
  },
  {
    script: 'geor',
    ranges: [
      [0x10a0, 0x10ff],
      [0x1c90, 0x1cbf],
      [0x2d00, 0x2d2f],
    ],
  },
  {
    script: 'mong',
    ranges: [[0x1800, 0x18af]],
  },
];

function normalizeContent(content: string) {
  return content.replace(/\r\n?/g, '\n').replace(/^\n+|\n+$/g, '');
}

function normalizeScript(script: string | undefined): ScriptCode | undefined {
  const normalized = script?.toLowerCase();

  if (!normalized || !supportedScripts.has(normalized as ScriptCode)) {
    return undefined;
  }

  return normalized as ScriptCode;
}

function getLocaleFamily(locale: string): 'en' | 'pl' {
  return locale.startsWith('pl') ? 'pl' : 'en';
}

function isLargeScript(script: string | undefined) {
  const normalized = normalizeScript(script);

  return Boolean(normalized && !normalSizeScripts.has(normalized));
}

function isVerticalScript(script: string | undefined) {
  const normalized = normalizeScript(script);

  return Boolean(normalized && verticalScripts.has(normalized));
}

function getScriptClassName(script: string | undefined) {
  return clsx(
    isLargeScript(script) && styles.scriptLarge,
    isVerticalScript(script) && styles.scriptVertical,
  );
}

function isCodePointInRanges(
  codePoint: number,
  ranges: Array<[number, number]>,
) {
  return ranges.some(([start, end]) => codePoint >= start && codePoint <= end);
}

function getLargeScriptForCodePoint(codePoint: number): ScriptCode | undefined {
  return largeScriptRanges.find(({ranges}) =>
    isCodePointInRanges(codePoint, ranges),
  )?.script;
}

function isNeutralCharacter(character: string) {
  return !letterOrNumberPattern.test(character);
}

function splitScriptRuns(content: string): ScriptRun[] {
  const runs: ScriptRun[] = [];
  let current: ScriptRun | undefined;

  function pushCurrent() {
    if (current?.text) {
      runs.push(current);
    }

    current = undefined;
  }

  for (const character of content) {
    const codePoint = character.codePointAt(0);
    const script =
      codePoint === undefined ? undefined : getLargeScriptForCodePoint(codePoint);

    if (!script && isNeutralCharacter(character)) {
      current = {
        text: `${current?.text ?? ''}${character}`,
        script: current?.script,
      };
      continue;
    }

    if (current && current.script === script) {
      current.text += character;
      continue;
    }

    pushCurrent();
    current = {
      text: character,
      script,
    };
  }

  pushCurrent();

  return runs;
}

function getRichContentDirection(
  kind: LessonKind,
  script: string | undefined,
): 'ltr' | 'rtl' | 'auto' {
  const normalized = normalizeScript(script);

  if (
    (kind === 'text' || kind === 'translation') &&
    normalized &&
    rtlScripts.has(normalized)
  ) {
    return 'rtl';
  }

  return kind === 'exercise' ? 'auto' : 'ltr';
}

function getSourceDirection(script: string | undefined): 'rtl' | 'auto' {
  const normalized = normalizeScript(script);

  return normalized && rtlScripts.has(normalized) ? 'rtl' : 'auto';
}

function getStrongText(segment: string) {
  return segment.startsWith('**') && segment.endsWith('**')
    ? segment.slice(2, -2)
    : undefined;
}

function renderFormattedInline(
  content: string,
  renderText: (text: string, keyPrefix: string) => ReactNode,
): ReactNode {
  return content
    .split(strongTextPattern)
    .filter(Boolean)
    .map((segment, index) => {
      const strongText = getStrongText(segment);
      const text = strongText ?? segment;
      const children = renderText(text, `segment-${index}`);

      if (strongText) {
        return <strong key={index}>{children}</strong>;
      }

      return <Fragment key={index}>{children}</Fragment>;
    });
}

// function renderInline(content: string): ReactNode {
//   return renderFormattedInline(content, (text) => text);
// }

function renderExerciseInline(content: string): ReactNode {
  return renderFormattedInline(content, (text, keyPrefix) =>
    splitScriptRuns(text).map((run, runIndex) => {
      if (!run.script) {
        return <Fragment key={`${keyPrefix}-${runIndex}`}>{run.text}</Fragment>;
      }

      return (
        <span
          className={clsx(styles.scriptRun, getScriptClassName(run.script))}
          dir={rtlScripts.has(run.script) ? 'rtl' : undefined}
          key={`${keyPrefix}-${runIndex}`}>
          {run.text}
        </span>
      );
    }),
  );
}

// function parseRichBlocks(content: string): RichBlock[] {
//   const blocks: RichBlock[] = [];
//   const paragraphLines: string[] = [];
//   let activeList: Extract<RichBlock, {type: 'ul' | 'ol' | 'alpha'}> | null =
//     null;

//   function flushParagraph() {
//     if (paragraphLines.length > 0) {
//       blocks.push({
//         type: 'paragraph',
//         lines: [...paragraphLines],
//       });
//       paragraphLines.length = 0;
//     }
//   }

//   function flushList() {
//     if (activeList) {
//       blocks.push(activeList);
//       activeList = null;
//     }
//   }

//   function addListItem(type: 'ul' | 'ol' | 'alpha', value: string) {
//     flushParagraph();

//     if (activeList?.type !== type) {
//       flushList();
//       activeList = {
//         type,
//         items: [],
//       };
//     }

//     activeList.items.push(value);
//   }

//   for (const line of content.split('\n')) {
//     if (!line.trim()) {
//       flushParagraph();
//       flushList();
//       continue;
//     }

//     const unorderedMatch = unorderedListPattern.exec(line);
//     if (unorderedMatch) {
//       addListItem('ul', unorderedMatch[1]);
//       continue;
//     }

//     const orderedMatch = orderedListPattern.exec(line);
//     if (orderedMatch) {
//       addListItem('ol', orderedMatch[1]);
//       continue;
//     }

//     const alphaMatch = alphaListPattern.exec(line);
//     if (alphaMatch) {
//       addListItem('alpha', alphaMatch[1]);
//       continue;
//     }

//     flushList();
//     paragraphLines.push(line.trimEnd());
//   }

//   flushParagraph();
//   flushList();

//   return blocks;
// }

function getExerciseListType(marker: string): ExerciseListType {
  if (marker === '*' || marker === '-') {
    return 'ul';
  }

  return /^\d+\.$/.test(marker) ? 'ol' : 'alpha';
}

function parseExerciseBlocks(content: string): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = [];
  const paragraphLines: string[] = [];
  let listStack: ExerciseListFrame[] = [];
  let hadBlankLine = false;

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        lines: [...paragraphLines],
      });
      paragraphLines.length = 0;
    }
  }

  function closeLists() {
    listStack = [];
  }

  function createList(type: ExerciseListType, indent: number): ExerciseListFrame {
    const list: ExerciseList = {
      type,
      items: [],
    };
    const parentFrame = listStack[listStack.length - 1];

    if (parentFrame?.lastItem && indent > parentFrame.indent) {
      parentFrame.lastItem.children.push(list);
    } else {
      blocks.push({
        type: 'list',
        list,
      });
    }

    const frame = {
      indent,
      list,
    };
    listStack.push(frame);

    return frame;
  }

  function getListFrame(type: ExerciseListType, indent: number) {
    while (
      listStack.length > 0 &&
      listStack[listStack.length - 1].indent > indent
    ) {
      listStack.pop();
    }

    const currentFrame = listStack[listStack.length - 1];

    if (currentFrame?.indent === indent && currentFrame.list.type === type) {
      return currentFrame;
    }

    if (currentFrame?.indent === indent) {
      listStack.pop();
    }

    return createList(type, indent);
  }

  for (const line of content.split('\n')) {
    if (!line.trim()) {
      flushParagraph();
      hadBlankLine = true;
      continue;
    }

    const listMatch = exerciseListPattern.exec(line);

    if (listMatch) {
      flushParagraph();
      hadBlankLine = false;

      const [, rawIndent, marker, value] = listMatch;
      const frame = getListFrame(getExerciseListType(marker), rawIndent.length);
      const item = {
        text: value,
        children: [],
      };

      frame.list.items.push(item);
      frame.lastItem = item;
      continue;
    }

    if (listStack.length > 0 && !hadBlankLine) {
      const currentFrame = listStack[listStack.length - 1];

      if (currentFrame.lastItem) {
        currentFrame.lastItem.text = `${currentFrame.lastItem.text} ${line.trim()}`;
        continue;
      }
    }

    closeLists();
    hadBlankLine = false;
    paragraphLines.push(line.trimEnd());
  }

  flushParagraph();
  closeLists();

  return blocks;
}

function renderExerciseList(list: ExerciseList, key: string) {
  const ListTag = list.type === 'ul' ? 'ul' : 'ol';

  return (
    <ListTag
      className={clsx(styles.list, styles.exerciseList)}
      key={key}
      type={list.type === 'alpha' ? 'a' : undefined}>
      {list.items.map((item, itemIndex) => (
        <li className={styles.exerciseItem} key={`${key}-${itemIndex}`}>
          <span className={styles.exerciseItemText} dir="auto">
            {renderExerciseInline(item.text)}
          </span>
          {item.children.map((childList, childIndex) =>
            renderExerciseList(childList, `${key}-${itemIndex}-${childIndex}`),
          )}
        </li>
      ))}
    </ListTag>
  );
}

function renderExerciseContent(content: string) {
  return (
    <div className={clsx(styles.richContent, styles.exerciseContent)}>
      {parseExerciseBlocks(content).map((block, blockIndex) => {
        if (block.type === 'paragraph') {
          return (
            <p className={styles.paragraph} dir="auto" key={blockIndex}>
              {block.lines.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {renderExerciseInline(line)}
                </Fragment>
              ))}
            </p>
          );
        }

        return renderExerciseList(block.list, `${blockIndex}`);
      })}
    </div>
  );
}

function renderRichContent(
  content: string,
  kind: LessonKind,
  script: string | undefined,
) {
  const direction = getRichContentDirection(kind, script);
  const listDirection = direction === 'rtl' ? 'rtl' : 'auto';
  const richContentClassName =
    kind === 'text' || kind === 'translation'
      ? getScriptClassName(script)
      : undefined;

  if (kind === 'exercise') {
    return renderExerciseContent(content);
  }

  // return (
  //   <div
  //     className={clsx(styles.richContent, richContentClassName)}
  //     dir={direction}>
  //     {parseRichBlocks(content).map((block, blockIndex) => {
  //       if (block.type === 'paragraph') {
  //         return (
  //           <p className={styles.paragraph} key={blockIndex} dir={direction}>
  //             {block.lines.map((line, lineIndex) => (
  //               <Fragment key={lineIndex}>
  //                 {lineIndex > 0 && <br />}
  //                 {renderInline(line)}
  //               </Fragment>
  //             ))}
  //           </p>
  //         );
  //       }

  //       const ListTag = block.type === 'ul' ? 'ul' : 'ol';

  //       return (
  //         <ListTag
  //           className={styles.list}
  //           key={blockIndex}
  //           type={block.type === 'alpha' ? 'a' : undefined}>
  //           {block.items.map((item, itemIndex) => (
  //             <li key={itemIndex} dir={listDirection}>
  //               {renderInline(item)}
  //             </li>
  //           ))}
  //         </ListTag>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div
      className={clsx(styles.richContent, richContentClassName)}
      dir={direction}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

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

function renderStructuredContent(content: string, script: string | undefined) {
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

export default function LessonElement({
  kind,
  content,
  lang,
  script,
  system,
}: LessonElementProps) {
  const {i18n} = useDocusaurusContext();
  const localeFamily = getLocaleFamily(i18n.currentLocale);
  const [isExpanded, setIsExpanded] = useState(true);
  const bodyId = useId();
  const label = labels[localeFamily][kind] ?? kind;
  const toggleLabel = isExpanded
    ? toggleLabels[localeFamily].collapse
    : toggleLabels[localeFamily].expand;
  const normalizedContent = normalizeContent(content);
  const isStructured = kind === 'vocabulary' || kind === 'models';
  const metadata = [lang, script, system].filter(Boolean);

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
          {isStructured
            ? renderStructuredContent(normalizedContent, script)
            : renderRichContent(normalizedContent, kind, script)}
        </div>
      )}
    </section>
  );
}
