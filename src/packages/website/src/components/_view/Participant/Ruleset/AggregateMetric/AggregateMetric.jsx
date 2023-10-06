import React from 'react';
import styles from './AggregateMetric.module.scss';
import BoxPlot from './BoxPlot/BoxPlot';
import Histogram from './Histogram/Histogram';
import RowTable from './RowTable/RowTable';

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

export default function AggregateMetric(props) {
  const {
    label,
    dataKey,
    data: {
      min,
      minOut,
      q1,
      median,
      avg,
      q3,
      maxOut,
      max,
      upperInterval,
      lowerInterval,
      histogram: originalHistogram,
    },
  } = props;

  const { histogram, domainX, domainY } = getHistogramData(originalHistogram);

  return (
    <div className={styles.aggregateMetric}>
      <div className={styles.title}>
        <h2>{label}</h2>
      </div>
      <div className={styles.graphsAndTable}>
        <div className={styles.charts}>
          <div className={styles.histogram}>
            <Histogram
              data={histogram}
              dataKey={dataKey}
              domainX={domainX}
              domainY={domainY}
              minOut={minOut}
              min={min}
              q1={q1}
              median={median}
              q3={q3}
              avg={avg}
              max={max}
              maxOut={maxOut}
            />
          </div>
          <div className={styles.boxPlot}>
            <BoxPlot
              domainX={domainX}
              minOut={minOut}
              min={min}
              q1={q1}
              median={median}
              q3={q3}
              avg={avg}
              max={max}
              maxOut={maxOut}
            />
          </div>
        </div>
        <div className={styles.table}>
          <RowTable
            dataKey={dataKey}
            lowerInterval={lowerInterval}
            upperInterval={upperInterval}
          />
        </div>
      </div>
    </div>
  );
}
