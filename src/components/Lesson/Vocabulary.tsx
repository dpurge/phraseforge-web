import Shell from './Shell';
import StructuredBody from './StructuredBody';
import {normalizeContent} from './shared';

type VocabularyProps = {
  content: string;
  lang?: string;
  script?: string;
};

export default function Vocabulary({content, lang, script}: VocabularyProps) {
  return (
    <Shell kind="vocabulary" lang={lang} script={script}>
      <StructuredBody content={normalizeContent(content)} script={script} />
    </Shell>
  );
}
