import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  filterDocCardListItems,
  useCurrentSidebarCategory,
} from '@docusaurus/plugin-content-docs/client';
import {PageMetadata} from '@docusaurus/theme-common';
import clsx from 'clsx';
import type {Props} from '@theme/DocCategoryGeneratedIndexPage';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocCardList from '@theme/DocCardList';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocVersionBanner from '@theme/DocVersionBanner';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const LESSONS_PER_PAGE = 60;
const PAGE_QUERY_KEY = 'page';

type PageItem = number | 'ellipsis';

function getCurrentPage(search: string, totalPages: number) {
  const pageValue = new URLSearchParams(search).get(PAGE_QUERY_KEY);

  if (!pageValue || !/^\d+$/.test(pageValue)) {
    return 1;
  }

  const page = Number(pageValue);
  return page >= 1 && page <= totalPages ? page : 1;
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 3);
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sortedPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return sortedPages.flatMap((page, index) => {
    const previousPage = sortedPages[index - 1];
    return previousPage && page - previousPage > 1
      ? ['ellipsis' as const, page]
      : [page];
  });
}

function getPageHref(
  pathname: string,
  search: string,
  hash: string,
  page: number,
) {
  const searchParams = new URLSearchParams(search);

  if (page === 1) {
    searchParams.delete(PAGE_QUERY_KEY);
  } else {
    searchParams.set(PAGE_QUERY_KEY, String(page));
  }

  const queryString = searchParams.toString();
  return `${pathname}${queryString ? `?${queryString}` : ''}${hash}`;
}

function DocCategoryGeneratedIndexPageMetadata({
  categoryGeneratedIndex,
}: Props) {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

type LessonIndexPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function LessonIndexPagination({
  currentPage,
  totalPages,
}: LessonIndexPaginationProps) {
  const {i18n} = useDocusaurusContext();
  const {pathname, search, hash} = useLocation();
  const isPolish = i18n.currentLocale === 'pl';
  const labels = {
    previous: isPolish ? 'Poprzednia' : 'Previous',
    next: isPolish ? 'Następna' : 'Next',
    pagination: isPolish ? 'Strony lekcji' : 'Lesson pages',
    page: isPolish ? 'Strona' : 'Page',
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageHref = (page: number) =>
    getPageHref(pathname, search, hash, page);

  return (
    <nav className={styles.pagination} aria-label={labels.pagination}>
      {currentPage > 1 ? (
        <Link className={styles.pageLink} to={pageHref(currentPage - 1)}>
          {labels.previous}
        </Link>
      ) : (
        <span className={clsx(styles.pageLink, styles.pageLinkDisabled)}>
          {labels.previous}
        </span>
      )}

      <ol className={styles.pageList}>
        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.pageListItem}>
              <span className={styles.pageEllipsis} aria-hidden="true">
                ...
              </span>
            </li>
          ) : (
            <li key={item} className={styles.pageListItem}>
              {item === currentPage ? (
                <span
                  className={clsx(styles.pageLink, styles.pageLinkActive)}
                  aria-current="page">
                  {item}
                </span>
              ) : (
                <Link
                  className={styles.pageLink}
                  to={pageHref(item)}
                  aria-label={`${labels.page} ${item}`}>
                  {item}
                </Link>
              )}
            </li>
          ),
        )}
      </ol>

      {currentPage < totalPages ? (
        <Link className={styles.pageLink} to={pageHref(currentPage + 1)}>
          {labels.next}
        </Link>
      ) : (
        <span className={clsx(styles.pageLink, styles.pageLinkDisabled)}>
          {labels.next}
        </span>
      )}
    </nav>
  );
}

function DocCategoryGeneratedIndexPageContent({
  categoryGeneratedIndex,
}: Props) {
  const category = useCurrentSidebarCategory();
  const {search} = useLocation();
  const items = filterDocCardListItems(category.items);
  const totalPages = Math.max(1, Math.ceil(items.length / LESSONS_PER_PAGE));
  const currentPage = getCurrentPage(search, totalPages);
  const startIndex = (currentPage - 1) * LESSONS_PER_PAGE;
  const visibleItems = items.slice(startIndex, startIndex + LESSONS_PER_PAGE);

  return (
    <div className={styles.generatedIndexPage}>
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />
      <header>
        <Heading as="h1" className={styles.title}>
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description && (
          <p>{categoryGeneratedIndex.description}</p>
        )}
      </header>
      <article className="margin-top--lg">
        <DocCardList items={visibleItems} className={styles.list} />
      </article>
      <LessonIndexPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
      <footer className="margin-top--md">
        <DocPaginator
          previous={categoryGeneratedIndex.navigation.previous}
          next={categoryGeneratedIndex.navigation.next}
        />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage(props: Props) {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
