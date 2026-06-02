import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import lessonElements from './src/remark/lessonElements';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const lessonFilenamePattern = /^(?<date>\d{4}-\d{2}-\d{2})-(?<sequence>[a-z])$/;

function parseLessonNumberPrefix(filename: string) {
  const match = lessonFilenamePattern.exec(filename);

  if (!match?.groups) {
    return {filename, numberPrefix: undefined};
  }

  const dateValue = Number(match.groups.date.replaceAll('-', ''));
  const sequenceValue =
    match.groups.sequence.charCodeAt(0) - 'a'.charCodeAt(0) + 1;

  return {
    filename,
    numberPrefix: -dateValue - sequenceValue / 100,
  };
}

const config: Config = {
  title: 'PhraseForge',
  tagline: 'Lekcje językowe oparte na praktycznych zwrotach i regularnych powtórkach.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://phraseforge.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'phraseforge', // Usually your GitHub org/user name.
  projectName: 'phraseforge-web', // Usually your repo name.

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    localeConfigs: {
      pl: {
        label: 'Polski',
        htmlLang: 'pl',
      },
      en: {
        label: 'English',
        htmlLang: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          numberPrefixParser: parseLessonNumberPrefix,
          remarkPlugins: [lessonElements],
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'Najnowsze wpisy',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/phraseforge-social-card.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PhraseForge',
      logo: {
        alt: 'PhraseForge logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'lessonsSidebar',
          position: 'left',
          label: 'Lekcje',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Languages',
      //         to: '/',
      //       },
      //       {
      //         label: 'Spanish',
      //         to: '/spa',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Lessons',
      //     items: [
      //       {
      //         label: 'German',
      //         to: '/deu',
      //       },
      //       {
      //         label: 'Spanish B1',
      //         to: '/spa/b1',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: '/blog',
      //       },
      //     ],
      //   },
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} PhraseForge.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
