import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import styles from '../StayTable.module.scss';
import useLabeller from '../../../../../../../hooks/useLabeller';

export default function LabelRow(props) {
  const { columns, label, labelNumber, isLast } = props;
  const { getLabelNumber, startTimeDate, endTimeDate, isInSelectedRange } =
    useLabeller();
  const labelClassName = styles[`label${getLabelNumber(labelNumber)}`];
  let reachedStartTime = false;
  let reachedEndTime = false;

  return (
    <TableRow
      key={label.id}
      className={`${styles.labelRow} ${isLast ? styles.lastLabel : ''}`}
      style={{
        top: `${4.9375 + labelNumber * 0.4}em`,
      }}
    >
      {columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return (
            <TableCell
              key={`${label.id}-${column.id}`}
              className={`${styles.parameterCell} ${styles.labelCell}`}
            />
          );
        }

        const isInRange = isInSelectedRange(
          new Date(column.id),
          startTimeDate,
          endTimeDate
        );

        if (label.startTime === column.id) {
          reachedStartTime = true;
        }

        if (reachedEndTime || !reachedStartTime) {
          return (
            <TableCell
              key={`${label.id}-${column.id}`}
              className={`${styles.labelCell} ${
                isInRange ? styles.inRange : ''
              }`}
            />
          );
        }

        if (label.endTime === column.id) {
          reachedEndTime = true;
        }

        return (
          <TableCell
            key={`${label.id}-${column.id}`}
            className={`${styles.labelCell} ${labelClassName} ${
              isInRange ? styles.inRange : ''
            }`}
          />
        );
      })}
    </TableRow>
  );
}
