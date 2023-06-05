import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  ReferenceLine,
  ComposedChart,
  Bar,
} from 'recharts';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import styles from './AggregateMetric.module.scss';
import BoxPlot from './BoxPlot/BoxPlot';

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

const newColors = {
  outliers: '#e1e1e1',
  outer: '#c1e5ff',
  inner: '#8ecfff',
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
  stops.push([domainX[0], newColors.outliers, 'start']);
  if (min < minOut) {
    stops.push([minOut, newColors.outliers, 'minOut-1']);
    stops.push([minOut, newColors.outer, 'minOut-2']);
  } else {
    stops.push([min, newColors.outliers, 'min-1']);
    stops.push([min, newColors.outer, 'min-2']);
  }

  stops.push([q1, newColors.outer, 'q1-1']);
  stops.push([q1, newColors.inner, 'q1-2']);
  stops.push([q3, newColors.inner, 'q3-1']);
  stops.push([q3, newColors.outer, 'q3-2']);

  if (max > maxOut) {
    stops.push([maxOut, newColors.outer, 'maxOut-1']);
    stops.push([maxOut, newColors.outliers, 'maxOut-2']);
  } else {
    stops.push([max, newColors.outer, 'max-1']);
    stops.push([max, newColors.outliers, 'max-2']);
  }
  stops.push([domainX[1], newColors.outliers, 'end']);

  const totalWidth = domainX[1] - domainX[0];
  const patternStops = [];

  stops.forEach((s, i) => {
    const [stop, fill, key] = s;
    const x = (stop - domainX[0]) / totalWidth;
    patternStops.push(
      <stop key={`stop-${key}-${dataKey}`} offset={x} stopColor={fill} />
    );
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
  // TODO: Max value might be outside of this interval because the interval bins are centered on each range
  const histY = histogram.map(([_, y]) => y);
  const minX = histogram[0][0];
  const maxX = histogram[histogram.length - 1][0];
  const minY = 0;
  const maxY = Math.max(...histY);
  const offsetX = 0.05 * (maxX - minX);
  const offsetY = 0.05 * (maxY - minY);
  const lowerBoundX = minX - offsetX;
  const upperBoundX = maxX + offsetX;
  const lowerBoundY = minY;
  const upperBoundY = maxY + offsetY;
  const tot = histY.reduce((curr, prev) => curr + prev, 0);
  const newHistogram = [[lowerBoundX, 0], ...histogram, [upperBoundX, 0]].map(
    ([x, y]) => [x, (y / tot) * 100]
  );

  return {
    histogram: newHistogram,
    domainX: [lowerBoundX, upperBoundX],
    domainY: [lowerBoundY, upperBoundY],
  };
}

export default function AggregateMetric(props) {
  const navigate = useNavigate();
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

  const areaData = histogram.map(([x, y]) => ({ x, y }));
  const patternId = `${dataKey}-pattern`;
  const areaId = `${dataKey}-area`;
  const areaClipPathId = `${dataKey}-areaClipPath`;

  return (
    <div className={styles.aggregateMetric}>
      <div className={styles.title}>
        <h2>{label}</h2>
      </div>
      <div className={styles.graphsAndTable}>
        <div className={styles.charts}>
          <div className={styles.histogram}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                {getDefs({
                  areaId,
                  areaClipPathId,
                })}
                <XAxis dataKey="x" domain={domainX} type="number" hide />

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
                  type="step"
                  stroke="#666"
                  dataKey="y"
                  fill={`url(#${patternId})`}
                  // fill="#ccc"
                  fillOpacity="1"
                />

                {refLines.map((r) => (
                  <ReferenceLine
                    key={`referenceLine-${dataKey}-${r.label}`}
                    x={r.x}
                    stroke={r.stroke ? r.stroke : '#666'}
                    strokeWidth={r.strokeWidth ? r.strokeWidth : 1}
                    strokeDasharray={
                      r.strokeDasharray ? r.strokeDasharray : '3 3'
                    }
                    clipPath={`url(#${areaClipPathId})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
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
              dataKey={dataKey}
            />
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <p className={styles.separator}>Top and bottom rows</p>
          </div>

          {lowerInterval.map(({ index, stayId, value }) => (
            <div className={styles.tableRow} key={`${dataKey}-lower-${index}`}>
              <p className={styles.index}>{index}.</p>
              <p className={styles.value}>{value.toFixed(3)}</p>
              <div className={styles.button}>
                <IconButton onClick={() => navigate(`stayId/${stayId}`)}>
                  <LaunchIcon />
                </IconButton>
              </div>
            </div>
          ))}

          <div className={styles.tableRow}>
            <p className={styles.separator}>...</p>
          </div>

          {upperInterval.map(({ index, stayId, value }) => (
            <div className={styles.tableRow} key={`${dataKey}-upper-${index}`}>
              <p className={styles.index}>{index}.</p>
              <p className={styles.value}>{value.toFixed(3)}</p>
              <div className={styles.button}>
                <IconButton onClick={() => navigate(`stayId/${stayId}`)}>
                  <LaunchIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
