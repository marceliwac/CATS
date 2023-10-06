import React from 'react';
import LabelRow from '../LabelRow/LabelRow';
import useLabeller from '../../../../../../../hooks/useLabeller';

export default function LabelRows(props) {
  const { columns } = props;
  const { labels } = useLabeller();
  return (
    <>
      {labels.map((label, labelNumber, labelArray) => (
        <LabelRow
          key={label.id}
          columns={columns}
          label={label}
          labelNumber={labelNumber}
          isLast={labelNumber === labelArray.length - 1}
        />
      ))}
    </>
  );
}
