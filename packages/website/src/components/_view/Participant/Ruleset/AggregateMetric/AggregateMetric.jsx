import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  ReferenceLine,
} from 'recharts';
import styles from './AggregateMetric.module.scss';

// const colors = {
//   gray: '#e1e1e1',
//   green: '#dcffc1',
//   yellow: '#fffcbf',
//   orange: '#ffe1b5',
//   red: '#ffc6bf',
// };

const colors = {
  gray: '#e1e1e1',
  green: '#c1e5ff',
  yellow: '#8ecfff',
  orange: '#8ecfff',
  red: '#c1e5ff',
};

function getPatternDef({
  dataKey,
  domainX,
  minOut,
  min,
  q1,
  median,
  q3,
  max,
  maxOut,
  patternId,
}) {
  const stops = [];
  const lowerBound = domainX[0];
  if (min < minOut) {
    stops.push([lowerBound, colors.gray, 'min']);
    stops.push([minOut, colors.green, 'minOut']);
  } else {
    stops.push([lowerBound, colors.gray, 'min']);
    stops.push([min, colors.green, 'minOut']);
  }
  stops.push([q1, colors.yellow, 'q1']);
  stops.push([median, colors.orange, 'q3']);

  if (max > maxOut) {
    stops.push([q3, colors.red, 'maxOut']);
    stops.push([maxOut, colors.gray, 'max']);
  } else {
    stops.push([q3, colors.red, 'maxOut']);
    stops.push([max, colors.gray, 'max']);
  }

  const totalWidth = domainX[1] - domainX[0];
  const patternStops = [];

  stops.forEach((s, i) => {
    const [stop, fill, key] = s;
    const x = stop / totalWidth;
    patternStops.push(
      <stop key={`stop-${key}-${dataKey}`} offset={x} y="0" stopColor={fill} />
    );

    if (i + 1 < stops.length) {
      const nextOffset = stops[i + 1][0] / totalWidth;
      patternStops.push(
        <stop
          key={`stop-next-${key}-${dataKey}`}
          offset={nextOffset}
          y="0"
          stopColor={fill}
        />
      );
    }
  });

  return (
    <defs>
      <linearGradient id={patternId} x1="0" y1="0" x2="1" y2="0">
        {patternStops}
      </linearGradient>
    </defs>
  );
}

function getDefs({ areaId, areaClipPathId }) {
  return (
    <defs>
      <clipPath id={areaClipPathId}>
        <use xlinkHref={`#${areaId}`} />
      </clipPath>
    </defs>
  );
}

function getHistogramData(histogram) {
  const lowerBoundX = 0;
  const lowerBoundY = histogram[0][0] === 0 ? histogram[0][1] : 0;
  const upperBoundX = Math.ceil(histogram[histogram.length - 1][0]) + 1;
  const upperBoundY = 0;
  const newHistogram = [
    [lowerBoundX, lowerBoundY],
    ...histogram,
    [upperBoundX, upperBoundY],
  ];
  const minX = 0;
  const minY = 0;
  const maxX = newHistogram[newHistogram.length - 1][0];
  const maxY = Math.ceil(Math.max(...newHistogram.map(([_, y]) => y))) + 1;

  return {
    histogram: newHistogram,
    domainX: [minX, maxX],
    domainY: [minY, maxY],
  };
}

export default function AggregateMetric(props) {
  const {
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
      r1,
      r2,
      r3,
      r4,
      histogram: originalHistogram,
    },
  } = props;

  const { histogram, domainX, domainY } = getHistogramData(originalHistogram);

  const refLines = [
    { label: 'Q1', x: q1 },
    { label: 'Q3', x: q3 },
    { label: 'Median', x: median },
    {
      label: 'Average',
      x: avg,
      stroke: '#ff6a6a',
      strokeWidth: '4',
      strokeDasharray: '0',
    },
  ];
  if (minOut > min) {
    refLines.push({ label: 'Q1 - 1.5 IQR', x: minOut });
    refLines.push({ label: 'Min', x: min });
  } else {
    refLines.push({ label: 'Q1 - 1.5 IQR', x: min });
  }

  if (maxOut < max) {
    refLines.push({ label: 'Q3 + 1.5 IQR', x: maxOut });
    refLines.push({ label: 'Max', x: max });
  } else {
    refLines.push({ label: 'Q3 + 1.5 IQR', x: max });
  }

  const areaData = histogram.map((v) => ({ x: v[0], y: v[1] }));
  const patternId = `${dataKey}-pattern`;
  const areaId = `${dataKey}-area`;
  const areaClipPathId = `${dataKey}-areaClipPath`;

  return (
    <div className={styles.aggregateMetric}>
      <div className={styles.charts}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData}>
            {getDefs({
              areaId,
              areaClipPathId,
            })}
            <XAxis dataKey="x" tickCount={15} domain={domainX} type="number" />
            <YAxis dataKey="y" domain={domainY} type="number" />

            {getPatternDef({
              domainX,
              minOut,
              min,
              q1,
              median,
              q3,
              max,
              maxOut,
              patternId,
              dataKey,
            })}
            <Area
              id={areaId}
              type="monotone"
              stroke="#666"
              dataKey="y"
              fill={`url(#${patternId})`}
              fillOpacity="1"
            />
            {refLines.map((r) => (
              <ReferenceLine
                key={`referenceLine-${dataKey}-${r.label}`}
                x={r.x}
                stroke={r.stroke ? r.stroke : '#666'}
                strokeWidth={r.strokeWidth ? r.strokeWidth : 1}
                strokeDasharray={r.strokeDasharray ? r.strokeDasharray : '3 3'}
                clipPath={`url(#${areaClipPathId})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.table}>
        {JSON.stringify(
          { min, minOut, q1, median, avg, q3, maxOut, max },
          null,
          2
        )}
      </div>
    </div>
  );
}
