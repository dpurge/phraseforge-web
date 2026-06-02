import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  marker: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Phrase first',
    marker: '01',
    description: (
      <>
        Each lesson starts from useful language, then breaks it into patterns
        learners can reuse in new situations.
      </>
    ),
  },
  {
    title: 'Practice ready',
    marker: '02',
    description: (
      <>
        Lesson pages include clear objectives, short prompts, and production
        tasks that work for any target language.
      </>
    ),
  },
  {
    title: 'Review built in',
    marker: '03',
    description: (
      <>
        Units include a repeatable review routine so new phrases stay connected
        to earlier lessons.
      </>
    ),
  },
];

function Feature({title, marker, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <span className={styles.featureMarker} aria-hidden="true">
          {marker}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
