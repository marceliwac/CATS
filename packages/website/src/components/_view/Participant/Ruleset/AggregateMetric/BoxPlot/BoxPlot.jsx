import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ErrorBar,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const colors = {
  gray: '#e1e1e1',
  green: '#c1e5ff',
  yellow: '#8ecfff',
  orange: '#8ecfff',
  red: '#c1e5ff',
  median: '#f17474',
};

const barSize = {
  min: 5,
  minOut: 20,
  q1: 40,
  q3: 40,
  maxOut: 20,
  max: 5,
};

export default function BoxPlot(props) {
  const { domainX, minOut, min, q1, median, q3, avg, max, maxOut, dataKey } =
    props;

  const certainLowerBound = minOut > min ? minOut : min;
  const certainUpperBound = maxOut < max ? maxOut : max;

  const data = [
    {
      a: [certainLowerBound, certainUpperBound],
      b: [q1, q3],
      c: [avg, avg],
      z: [min, max],
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

  const MyTick = (p) => {
    const { x, y, payload } = p;
    const matching = tickArray.find((item) => item.value === payload.value);
    return (
      <g transform={`translate(${x}, ${y})`}>
        <text
          x={0}
          y={0}
          dx={-20}
          dy={24}
          fill="#999"
          textAnchor="end"
          transform="rotate(-45)"
          fontFamily="sans-serif"
        >
          {matching.key}
        </text>
        <text
          x={0}
          y={0}
          dy={18}
          fill="#666"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          {matching.value.toFixed(1)}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={domainX}
          interval={0}
          ticks={ticks}
          tick={<MyTick />}
          height={120}
        />
        <YAxis yAxisId="ay" type="category" tick={false} />
        <YAxis yAxisId="by" type="category" hide />
        <YAxis yAxisId="cy" type="category" hide />
        <YAxis yAxisId="dy" type="category" hide />
        <YAxis yAxisId="ey" type="category" hide />
        <YAxis yAxisId="fy" type="category" hide />
        <YAxis yAxisId="zy" type="category" hide />

        <Bar yAxisId="zy" dataKey="z" fill="#999" barSize={2} />
        <Bar
          yAxisId="ay"
          dataKey="a"
          fill={colors.green}
          barSize={barSize.minOut}
        />

        <Bar
          yAxisId="by"
          dataKey="b"
          fill={colors.yellow}
          barSize={barSize.q1}
        />
        <ReferenceLine
          yAxisId="cy"
          x={avg}
          strokeWidth={4}
          stroke="transparent"
          viewBox={{ x: 5, y: 5, width: 5, height: 5 }}
        >
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
                  stroke={colors.median}
                  strokeWidth={4}
                />
              );
            }}
          />
        </ReferenceLine>

        <ReferenceLine
          yAxisId="dy"
          x={median}
          strokeWidth={4}
          stroke="transparent"
          viewBox={{ x: 5, y: 5, width: 5, height: 5 }}
        >
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
                  stroke="#999"
                  strokeWidth={2}
                />
              );
            }}
          />
        </ReferenceLine>

        <ReferenceLine
          yAxisId="ey"
          x={min}
          strokeWidth={2}
          stroke="transparent"
        >
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
                  stroke="#999"
                  strokeWidth={2}
                />
              );
            }}
          />
        </ReferenceLine>
        <ReferenceLine yAxisId="fy" x={max} stroke="transparent">
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
                  stroke="#999"
                  strokeWidth={2}
                />
              );
            }}
          />
        </ReferenceLine>
        {/* <Bar stackId="a" dataKey={min} fill="red" /> */}
        {/* <Bar dataKey={q1} fill="yellow" /> */}
        {/* <Bar dataKey={median} fill="cyan" /> */}
        {/* <Bar dataKey={avg} fill="orange" /> */}
        {/* <Bar dataKey={q3} fill="green" /> */}
        {/* <Bar stackId="a" dataKey={max} fill="blue" /> */}
        {/* <Bar stackId="a" dataKey="max" fill="blue" /> */}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
