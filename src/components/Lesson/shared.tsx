import clsx from 'clsx';
import {createContext} from 'react';

import styles from './styles.module.css';

export type Kind =
  | 'text'
  | 'transcription'
  | 'translation'
  | 'vocabulary'
  | 'models'
  | 'exercise'
  | 'dialog'
  | 'questions'
  | 'inflection';

export type ExerciseType =
  | 'translation'
  | 'fill-gaps'
  | 'word-order'
  | 'multiple-choice'
  | 'matching'
  | 'true-false'
  | 'open-answer';

export type InflectionType = 'conjugation' | 'declension';

export type ScriptCode =
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

export const labels: Record<'en' | 'pl', Record<Kind, string>> = {
  en: {
    text: 'Text',
    transcription: 'Transcription',
    translation: 'Translation',
    vocabulary: 'Vocabulary',
    models: 'Models',
    exercise: 'Exercise',
    dialog: 'Dialogue',
    questions: 'Questions',
    inflection: 'Inflection',
  },
  pl: {
    text: 'Tekst',
    transcription: 'Transkrypcja',
    translation: 'Tłumaczenie',
    vocabulary: 'Słownictwo',
    models: 'Modele',
    exercise: 'Ćwiczenie',
    dialog: 'Dialog',
    questions: 'Pytania',
    inflection: 'Odmiana',
  },
};

export const typeLabels: Record<'en' | 'pl', Record<ExerciseType, string>> = {
  en: {
    translation: 'Translation',
    'fill-gaps': 'Fill in the gaps',
    'word-order': 'Word order',
    'multiple-choice': 'Multiple choice',
    matching: 'Matching',
    'true-false': 'True/False',
    'open-answer': 'Open answer',
  },
  pl: {
    translation: 'Tłumaczenie',
    'fill-gaps': 'Uzupełnij luki',
    'word-order': 'Kolejność słów',
    'multiple-choice': 'Wybór wielokrotny',
    matching: 'Dopasowanie',
    'true-false': 'Prawda/Fałsz',
    'open-answer': 'Otwarte pytanie',
  },
};

export const inflectionTypeLabels: Record<
  'en' | 'pl',
  Record<InflectionType, string>
> = {
  en: {
    conjugation: 'Conjugation',
    declension: 'Declension',
  },
  pl: {
    conjugation: 'Koniugacja',
    declension: 'Deklinacja',
  },
};

export const toggleLabels: Record<
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

export type ScriptContextValue = {
  lang?: string;
  script?: string;
} | null;

export const ScriptContext =
  createContext<ScriptContextValue>(null);

export function normalizeContent(content: string) {
  return content.replace(/\r\n?/g, '\n').replace(/^\n+|\n+$/g, '');
}

export function normalizeScript(
  script: string | undefined,
): ScriptCode | undefined {
  const normalized = script?.toLowerCase();

  if (!normalized || !supportedScripts.has(normalized as ScriptCode)) {
    return undefined;
  }

  return normalized as ScriptCode;
}

export function getLocaleFamily(locale: string): 'en' | 'pl' {
  return locale.startsWith('pl') ? 'pl' : 'en';
}

export function isLargeScript(script: string | undefined) {
  const normalized = normalizeScript(script);

  return Boolean(normalized && !normalSizeScripts.has(normalized));
}

export function isVerticalScript(script: string | undefined) {
  const normalized = normalizeScript(script);

  return Boolean(normalized && verticalScripts.has(normalized));
}

export function isRtlScript(script: string | undefined) {
  const normalized = normalizeScript(script);

  return Boolean(normalized && rtlScripts.has(normalized));
}

export function getScriptClassName(script: string | undefined) {
  return clsx(
    isLargeScript(script) && styles.scriptLarge,
    isVerticalScript(script) && styles.scriptVertical,
  );
}

export function getBodyDirection(
  kind: Kind,
  script: string | undefined,
): 'ltr' | 'rtl' {
  if (
    (kind === 'text' ||
      kind === 'translation' ||
      kind === 'exercise' ||
      kind === 'dialog' ||
      kind === 'questions' ||
      kind === 'inflection') &&
    isRtlScript(script)
  ) {
    return 'rtl';
  }

  return 'ltr';
}

export function getSourceDirection(
  script: string | undefined,
): 'rtl' | 'auto' {
  return isRtlScript(script) ? 'rtl' : 'auto';
}
