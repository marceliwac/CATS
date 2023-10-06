import React from 'react';
import RulesetConfig from '../../../RulesetConfig';

export default function HistogramTick(props) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        fill={RulesetConfig.colors.textPrimary}
        textAnchor="end"
        fontFamily="sans-serif"
      >
        {`${payload.value} %`}
      </text>
    </g>
  );
}
