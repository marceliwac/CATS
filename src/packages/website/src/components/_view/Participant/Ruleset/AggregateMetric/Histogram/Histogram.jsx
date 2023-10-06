import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './Histogram.module.scss';
import RulesetConfig from '../../RulesetConfig';
import HistogramTick from './HistogramTick/HistogramTick';

function getDefs({ areaId, areaClipPathId }) {
  return (
    <defs>
      <clipPath id={areaClipPathId}>
        <use xlinkHref={`#${areaId}`} />
      </clipPath>
    </defs>
  );
}

function getPatternDef({
  dataKey,
  domainX,
  minOut,
  min,
  q1,
  q3,
  max,
  maxOut,
  patternId,
}) {
  const stops = [];

  if (min === max) {
    stops.push([domainX[0], RulesetConfig.colors.inner, 'start']);
  } else {
    stops.push([domainX[0], RulesetConfig.colors.outliers, 'start']);
    if (minOut >= min) {
      stops.push([minOut, RulesetConfig.colors.outliers, 'minOut-1']);
      stops.push([minOut, RulesetConfig.colors.outer, 'minOut-2']);
    } else {
      stops.push([min, RulesetConfig.colors.outliers, 'min-1']);
      stops.push([min, RulesetConfig.colors.outer, 'min-2']);
    }

    stops.push([q1, RulesetConfig.colors.outer, 'q1-1']);
    stops.push([q1, RulesetConfig.colors.inner, 'q1-2']);
    stops.push([q3, RulesetConfig.colors.inner, 'q3-1']);
    stops.push([q3, RulesetConfig.colors.outer, 'q3-2']);

    if (maxOut <= max) {
      stops.push([maxOut, RulesetConfig.colors.outer, 'maxOut-1']);
      stops.push([maxOut, RulesetConfig.colors.outliers, 'maxOut-2']);
    } else {
      stops.push([max, RulesetConfig.colors.outer, 'max-1']);
      stops.push([max, RulesetConfig.colors.outliers, 'max-2']);
    }
    stops.push([domainX[1], RulesetConfig.colors.outliers, 'end']);
  }

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

function getRefLines({ min, minOut, q1, median, avg, q3, maxOut, max }) {
  const refLines = [
    { label: 'Q1', x: q1 },
    { label: 'Q3', x: q3 },
    {
      label: 'Median',
      x: median,
      stroke: RulesetConfig.colors.median,
      strokeWidth: 2,
      strokeDasharray: '0',
    },
    {
      label: 'Average',
      x: avg,
      stroke: RulesetConfig.colors.avg,
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

  return refLines;
}

export default function Histogram(props) {
  const {
    domainX,
    domainY,
    dataKey,
    data,
    minOut,
    min,
    q1,
    median,
    avg,
    q3,
    max,
    maxOut,
  } = props;

  const yAxisTicks = Array.from(
    { length: domainY[1] / 5 + 1 },
    (_, i) => i * 5
  );

  const areaData = data.map(([x, y]) => ({ x, y }));
  const patternId = `${dataKey}-pattern`;
  const areaId = `${dataKey}-area`;
  const areaClipPathId = `${dataKey}-areaClipPath`;

  const refLines = getRefLines({
    minOut,
    min,
    q1,
    median,
    avg,
    q3,
    max,
    maxOut,
  });

  const patternDef = getPatternDef({
    domainX,
    minOut,
    min,
    q1,
    q3,
    max,
    maxOut,
    patternId,
    dataKey,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={areaData}>
        {getDefs({
          areaId,
          areaClipPathId,
        })}

        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="x" domain={domainX} type="number" tick={false} />

        <YAxis
          dataKey="y"
          domain={domainY}
          type="number"
          tick={<HistogramTick />}
          ticks={yAxisTicks}
          padding={{ top: 8 }}
          interval={0}
        />

        {patternDef}
        <Area
          id={areaId}
          type="step"
          stroke={RulesetConfig.colors.textPrimary}
          dataKey="y"
          fill={`url(#${patternId})`}
          fillOpacity="1"
        />

        {refLines.map((r) => (
          <ReferenceLine
            key={`referenceLine-${dataKey}-${r.label}`}
            x={r.x}
            stroke={r.stroke ? r.stroke : RulesetConfig.colors.textPrimary}
            strokeWidth={r.strokeWidth ? r.strokeWidth : 1}
            strokeDasharray={r.strokeDasharray ? r.strokeDasharray : '3 3'}
            clipPath={`url(#${areaClipPathId})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
