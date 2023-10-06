import React from 'react';
import styles from './LabelStatisticsSkeleton.module.scss';

export default function LabelStatisticsSkeleton() {
  return (
    <div className={styles.labelStatistics}>
      <div className={styles.pieChart}>
        <div className={`${styles.outerPie} ${styles.skeletonDark}`}>
          <div className={styles.innerPie}>
            <div className={styles.skeletonMedium} />
            <div className={styles.skeletonLight} />
            <div className={styles.skeletonLight} />
          </div>
        </div>
      </div>
      <div className={styles.parameters}>
        {Array.from({ length: 6 }, (_, i) => i).map((keyIndex) => (
          <div
            key={`${keyIndex}-skeleton-parameter`}
            className={styles.parameter}
          >
            <p className={`${styles.label} ${styles.skeletonDark}`} />
            <p className={`${styles.value} ${styles.skeletonLight}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
