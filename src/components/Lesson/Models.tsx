import Shell from './Shell';
import StructuredBody from './StructuredBody';
import {normalizeContent} from './shared';

type ModelsProps = {
  content: string;
  lang?: string;
  script?: string;
};

export default function Models({content, lang, script}: ModelsProps) {
  return (
    <Shell kind="models" lang={lang} script={script}>
      <StructuredBody content={normalizeContent(content)} script={script} />
    </Shell>
  );
}
