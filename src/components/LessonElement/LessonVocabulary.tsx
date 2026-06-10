import Shell from './Shell';
import StructuredBody from './StructuredBody';
import {normalizeContent} from './shared';

type LessonVocabularyProps = {
  content: string;
  lang?: string;
  script?: string;
};

export default function LessonVocabulary({
  content,
  lang,
  script,
}: LessonVocabularyProps) {
  return (
    <Shell kind="vocabulary" lang={lang} script={script}>
      <StructuredBody content={normalizeContent(content)} script={script} />
    </Shell>
  );
}
