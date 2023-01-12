import React from 'react';
import LabelRow from '../LabelRow/LabelRow';
import useLabeller from '../../../../../../../hooks/useLabeller';

export default function LabelRows(props) {
  const { columns } = props;
  const { labels } = useLabeller();
  const generalLabels = labels.filter(
    (label) => label.additionalData.labelType === 'general'
  );
  const sprintLabels = labels.filter(
    (label) => label.additionalData.labelType === 'sprint'
  );
  return (
    <>
      {generalLabels.map((label, labelNumber, labelArray) => (
        <LabelRow
          key={label.id}
          columns={columns}
          label={label}
          labelNumber={labelNumber}
          totalLabelNumber={labelNumber}
          isLast={
            labelNumber === labelArray.length - 1 && sprintLabels.length === 0
          }
        />
      ))}
      {sprintLabels.map((label, labelNumber, labelArray) => (
        <LabelRow
          key={label.id}
          columns={columns}
          label={label}
          labelNumber={labelNumber}
          totalLabelNumber={labelNumber + generalLabels.length}
          isLast={labelNumber === labelArray.length - 1}
        />
      ))}
    </>
  );
}
