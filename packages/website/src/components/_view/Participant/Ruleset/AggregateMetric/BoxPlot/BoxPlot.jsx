import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import BoxPlotTick from './BoxPlotTick/BoxPlotTick';
import RulesetConfig from '../../RulesetConfig';

export default function BoxPlot(props) {
  const { domainX, minOut, min, q1, median, q3, avg, max, maxOut } = props;

  const certainLowerBound = minOut > min ? minOut : min;
  const certainUpperBound = maxOut < max ? maxOut : max;

  const data = [
    {
      outer: [certainLowerBound, certainUpperBound],
      inner: [q1, q3],
      outliers: [min, max],
    },
  ];

  const tickArray = [
    { value: min, key: 'minimum', offset: minOut > min ? 32 : 0 },
    { value: q1, key: 'Q1', offset: 32 },
    {
      value: median,
      key: 'median',
      offset: 64,
    },
    { value: avg, key: 'avgerage', offset: 0 },
    { value: q3, key: 'Q3', offset: 48 },
    {
      value: max,
      key: 'maximum',
      offset: maxOut < max ? 32 : 0,
    },
  ];

  if (minOut > min) {
    tickArray.push({ value: minOut, key: 'Q1 - 1.5 IQR', offset: 0 });
  }
  if (maxOut < max) {
    tickArray.push({ value: maxOut, key: 'Q3 + 1.5 IQR', offset: 0 });
  }

  const ticks = tickArray.map((t) => t.value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={domainX}
          interval={0}
          ticks={ticks}
          tick={<BoxPlotTick tickArray={tickArray} />}
          height={120}
        />
        <YAxis yAxisId="innerAxis" type="category" tick={false} />
        <YAxis yAxisId="outerAxis" type="category" hide />
        <YAxis yAxisId="outliersAxis" type="category" hide />
        <YAxis yAxisId="avgAxis" type="category" hide />
        <YAxis yAxisId="medianAxis" type="category" hide />
        <YAxis yAxisId="minOutlierAxis" type="category" hide />
        <YAxis yAxisId="maxOutlierAxis" type="category" hide />

        <Bar
          yAxisId="outliersAxis"
          dataKey="outliers"
          fill={RulesetConfig.colors.outliersDarker}
          barSize={RulesetConfig.boxPlot.size.outliers}
        />
        <Bar
          yAxisId="outerAxis"
          dataKey="outer"
          fill={RulesetConfig.colors.outer}
          barSize={RulesetConfig.boxPlot.size.outer}
        />

        <Bar
          yAxisId="innerAxis"
          dataKey="inner"
          fill={RulesetConfig.colors.inner}
          barSize={RulesetConfig.boxPlot.size.inner}
        />
        <ReferenceLine yAxisId="avgAxis" x={avg} stroke="transparent">
          <Label
            content={(p) => {
              const {
                viewBox: { x },
              } = p;
              return (
                <line
                  x1={x}
                  x2={x}
                  y1={16}
                  y2={56}
                  stroke={RulesetConfig.colors.avg}
                  strokeWidth={RulesetConfig.refLines.avg.stroke}
                />
              );
            }}
          />
        </ReferenceLine>

        <ReferenceLine yAxisId="medianAxis" x={median} stroke="transparent">
          <Label
            content={(p) => {
              const {
                viewBox: { x },
              } = p;
              return (
                <line
                  x1={x}
                  x2={x}
                  y1={16}
                  y2={56}
                  stroke={RulesetConfig.colors.median}
                  strokeWidth={RulesetConfig.refLines.median.stroke}
                />
              );
            }}
          />
        </ReferenceLine>

        <ReferenceLine yAxisId="minOutlierAxis" x={min} stroke="transparent">
          <Label
            content={(p) => {
              const {
                viewBox: { x },
              } = p;
              return (
                <line
                  x1={x}
                  x2={x}
                  y1={16}
                  y2={56}
                  stroke={RulesetConfig.colors.outliersDarker}
                  strokeWidth={RulesetConfig.refLines.outlier.stroke}
                />
              );
            }}
          />
        </ReferenceLine>
        <ReferenceLine yAxisId="maxOutlierAxis" x={max} stroke="transparent">
          <Label
            content={(p) => {
              const {
                viewBox: { x },
              } = p;
              return (
                <line
                  x1={x}
                  x2={x}
                  y1={16}
                  y2={56}
                  stroke={RulesetConfig.colors.outliersDarker}
                  strokeWidth={RulesetConfig.refLines.outlier.stroke}
                />
              );
            }}
          />
        </ReferenceLine>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
