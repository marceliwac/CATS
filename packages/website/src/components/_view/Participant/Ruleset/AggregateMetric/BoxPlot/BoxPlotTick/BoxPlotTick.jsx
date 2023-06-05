import React from 'react';
import RulesetConfig from '../../../RulesetConfig';

export default function BoxPlotTick(props) {
  const { x, y, payload, tickArray } = props;
  const matching = tickArray.find((item) => item.value === payload.value);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        x={0}
        y={0}
        dx={-20}
        dy={24}
        fill={RulesetConfig.colors.textSecondary}
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
        fill={RulesetConfig.colors.textPrimary}
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        {matching.value.toFixed(1)}
      </text>
    </g>
  );
}
