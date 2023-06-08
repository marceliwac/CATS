import React from 'react';
import RulesetConfig from '../../../RulesetConfig';

export default function BoxPlotBar(props) {
  const { fill, x, y, width, height } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={RulesetConfig.colors.boxPlotOutline}
        strokeWidth={1}
        fill={fill}
      />
    </g>
  );
}
