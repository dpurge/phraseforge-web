import {fromMarkdown} from 'mdast-util-from-markdown';

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

const lessonBlockPattern = /^(vocabulary|models|dialog)$/;
const metaAttributePattern =
  /(?:^|\s)([A-Za-z_][\w-]*)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;

const componentNameByKind: Record<string, string> = {
  vocabulary: 'Vocabulary',
  models: 'Models',
};

const dialogTitlePattern = /^#\s+(.+?)\s*$/;
const namedTurnPattern = /^@(.+?):\s*$/;
const anonymousTurnPattern = /^--:\s*$/;
const indentPattern = /^(?:    |  |\t)(.*)$/;

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

function createLessonNode(
  kind: string,
  content: string,
  metadata: Record<string, string>,
): MdastNode {
  const attributes = [
    mdxAttribute('content', content),
    ...Object.entries(metadata)
      .filter(([name]) => name !== 'kind' && name !== 'content')
      .map(([name, value]) => mdxAttribute(name, value)),
  ];

  return {
    type: 'mdxJsxFlowElement',
    name: componentNameByKind[kind],
    attributes,
    children: [],
  };
}

type DialogBlock =
  | {kind: 'narration'; paragraphs: string[]}
  | {kind: 'turn'; speaker?: string; paragraphs: string[]};

function joinParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length > 0) {
      paragraphs.push(current.join(' '));
      current = [];
    }
  };

  for (const line of lines) {
    if (line.trim() === '') {
      flush();
    } else {
      current.push(line.trim());
    }
  }

  flush();
  return paragraphs;
}

function parseDialogContent(content: string): {
  title?: string;
  blocks: DialogBlock[];
} {
  const lines = content.split('\n');
  let cursor = 0;

  while (cursor < lines.length && lines[cursor].trim() === '') {
    cursor++;
  }

  let title: string | undefined;
  if (cursor < lines.length) {
    const titleMatch = dialogTitlePattern.exec(lines[cursor]);
    if (titleMatch) {
      title = titleMatch[1].trim();
      cursor++;
    }
  }

  const blocks: DialogBlock[] = [];
  let narrationLines: string[] = [];
  let currentTurn: {speaker?: string; bodyLines: string[]} | null = null;

  const flushNarration = () => {
    if (narrationLines.length === 0) return;
    const paragraphs = joinParagraphs(narrationLines);
    if (paragraphs.length > 0) {
      blocks.push({kind: 'narration', paragraphs});
    }
    narrationLines = [];
  };

  const flushTurn = () => {
    if (!currentTurn) return;
    const paragraphs = joinParagraphs(currentTurn.bodyLines);
    blocks.push({
      kind: 'turn',
      speaker: currentTurn.speaker,
      paragraphs,
    });
    currentTurn = null;
  };

  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor];
    const indentMatch = indentPattern.exec(line);
    const isBlank = line.trim() === '';

    if (currentTurn) {
      if (indentMatch) {
        currentTurn.bodyLines.push(indentMatch[1]);
        continue;
      }
      if (isBlank) {
        currentTurn.bodyLines.push('');
        continue;
      }
      flushTurn();
    }

    if (isBlank) {
      narrationLines.push('');
      continue;
    }

    const namedMatch = namedTurnPattern.exec(line);
    if (namedMatch) {
      flushNarration();
      currentTurn = {speaker: namedMatch[1].trim(), bodyLines: []};
      continue;
    }

    if (anonymousTurnPattern.test(line)) {
      flushNarration();
      currentTurn = {bodyLines: []};
      continue;
    }

    narrationLines.push(line);
  }

  flushTurn();
  flushNarration();

  return {title, blocks};
}

function parseInline(text: string): MdastNode[] {
  if (!text.trim()) {
    return [{type: 'text', value: text}];
  }

  const tree = fromMarkdown(text) as MdastNode;
  const out: MdastNode[] = [];

  for (const child of tree.children ?? []) {
    if (child.type === 'paragraph' && child.children) {
      out.push(...child.children);
    } else {
      out.push(child);
    }
  }

  return out;
}

function paragraphNode(text: string): MdastNode {
  return {
    type: 'paragraph',
    children: parseInline(text),
  };
}

function createDialogNode(
  content: string,
  metadata: Record<string, string>,
): MdastNode {
  const {title, blocks} = parseDialogContent(content);

  const attributes: MdxAttribute[] = [];
  if (title) {
    attributes.push(mdxAttribute('title', title));
  }
  for (const [name, value] of Object.entries(metadata)) {
    if (name === 'kind' || name === 'content' || name === 'title') continue;
    attributes.push(mdxAttribute(name, value));
  }

  const children: MdastNode[] = [];
  for (const block of blocks) {
    if (block.kind === 'narration') {
      for (const paragraph of block.paragraphs) {
        children.push(paragraphNode(paragraph));
      }
      continue;
    }

    const turnAttributes: MdxAttribute[] = [];
    if (block.speaker) {
      turnAttributes.push(mdxAttribute('speaker', block.speaker));
    }
    const turnChildren = block.paragraphs.map(paragraphNode);
    children.push({
      type: 'mdxJsxFlowElement',
      name: 'Turn',
      attributes: turnAttributes,
      children: turnChildren,
    });
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'Dialog',
    attributes,
    children,
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
        const kind = match[1];
        const metadata = parseMetaAttributes(child.meta);
        const content = child.value ?? '';

        if (kind === 'dialog') {
          return createDialogNode(content, metadata);
        }

        return createLessonNode(kind, content, metadata);
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
