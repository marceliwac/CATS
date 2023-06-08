import React from 'react';
import RulesetLabelRow from '../RulesetLabelRow/RulesetLabelRow';

export default function RulesetLabelRows(props) {
  const { columns, labels } = props;
  return (
    <>
      {labels.map((label, labelNumber, labelArray) => (
        <RulesetLabelRow
          key={`rulesetLabelRowsRow-${label.id}`}
          columns={columns}
          label={label}
          labelNumber={labelNumber}
          isLast={labelNumber === labelArray.length - 1}
        />
      ))}
    </>
  );
}
