import Shell from './Shell';
import StructuredBody from './StructuredBody';
import {normalizeContent} from './shared';

type LessonModelsProps = {
  content: string;
  lang?: string;
  script?: string;
};

export default function LessonModels({
  content,
  lang,
  script,
}: LessonModelsProps) {
  return (
    <Shell kind="models" lang={lang} script={script}>
      <StructuredBody content={normalizeContent(content)} script={script} />
    </Shell>
  );
}
