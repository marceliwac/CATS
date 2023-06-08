import React from 'react';
import styles from './AggregateMetricSkeleton.module.scss';

function getHistogramData(histogram) {
  const histY = histogram.map(([_, y]) => y);
  const minX = histogram[0][0];
  const maxX = histogram[histogram.length - 1][0];
  const offsetX = 0.05 * (maxX - minX);
  const lowerBoundX = minX - offsetX;
  const upperBoundX = maxX + offsetX;
  const tot = histY.reduce((curr, prev) => curr + prev, 0);
  const newHistogram = [[lowerBoundX, 0], ...histogram, [upperBoundX, 0]].map(
    ([x, y]) => [x, (y / tot) * 100]
  );
  const maxY = Math.max(...newHistogram.map(([_, y]) => y));
  const lowerBoundY = 0;
  const upperBoundY =
    Math.ceil(maxY) % 5 === 0
      ? Math.ceil(maxY)
      : Math.ceil(maxY) + 5 - (Math.ceil(maxY) % 5);

  return {
    histogram: newHistogram,
    domainX: [lowerBoundX, upperBoundX],
    domainY: [lowerBoundY, upperBoundY],
  };
}

export default function AggregateMetric() {
  // const { histogram, domainX, domainY } = getHistogramData(originalHistogram);

  return (
    <div className={styles.aggregateMetric}>
      <div className={`${styles.title} ${styles.skeletonDark}`} />
      <div className={styles.graphsAndTable}>
        <div className={styles.charts}>
          <div className={styles.histogram}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className={styles.boxPlot}>
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.separator} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          <div className={styles.skeletonMedium} />
          {/* <RowTable */}
          {/*  dataKey={dataKey} */}
          {/*  lowerInterval={lowerInterval} */}
          {/*  upperInterval={upperInterval} */}
          {/* /> */}
        </div>
      </div>
    </div>
  );
}
