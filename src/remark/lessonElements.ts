type MdxAttribute = {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
};

type MdastNode = {
  type?: string;
  lang?: string | null;
  meta?: string | null;
  value?: string;
  children?: MdastNode[];
  [key: string]: unknown;
};

const lessonBlockPattern =
  /^lesson-(text|transcription|translation|vocabulary|models|exercise)$/;
const metaAttributePattern =
  /(?:^|\s)([A-Za-z_][\w-]*)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;

function parseMetaAttributes(meta: string | null | undefined) {
  const attributes: Record<string, string> = {};

  for (const match of meta?.matchAll(metaAttributePattern) ?? []) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name] = doubleQuoted ?? singleQuoted ?? unquoted ?? '';
  }

  return attributes;
}

function mdxAttribute(name: string, value: string): MdxAttribute {
  return {
    type: 'mdxJsxAttribute',
    name,
    value,
  };
}

function createLessonElementNode(
  kind: string,
  content: string,
  metadata: Record<string, string>,
): MdastNode {
  const attributes = [
    mdxAttribute('kind', kind),
    mdxAttribute('content', content),
    ...Object.entries(metadata)
      .filter(([name]) => name !== 'kind' && name !== 'content')
      .map(([name, value]) => mdxAttribute(name, value)),
  ];

  return {
    type: 'mdxJsxFlowElement',
    name: 'LessonElement',
    attributes,
    children: [],
  };
}

function transformLessonBlocks(node: MdastNode): void {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    if (child.type === 'code' && child.lang) {
      const match = lessonBlockPattern.exec(child.lang);

      if (match) {
        return createLessonElementNode(
          match[1],
          child.value ?? '',
          parseMetaAttributes(child.meta),
        );
      }
    }

    transformLessonBlocks(child);
    return child;
  });
}

export default function lessonElements() {
  return function transformer(tree: MdastNode): void {
    transformLessonBlocks(tree);
  };
}
