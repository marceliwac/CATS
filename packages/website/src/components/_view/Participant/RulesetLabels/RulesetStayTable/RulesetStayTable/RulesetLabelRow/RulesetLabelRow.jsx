import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import styles from '../RulesetStayTable.module.scss';

function isInSelectedRange(date, startTimeDate, endTimeDate) {
  if (startTimeDate && endTimeDate) {
    return date >= startTimeDate && date <= endTimeDate;
  }
  if (startTimeDate) {
    return date >= startTimeDate;
  }
  if (endTimeDate) {
    return date <= endTimeDate;
  }
  return false;
}

export default function RulesetLabelRow(props) {
  const { columns, label, labelNumber, isLast } = props;
  const startTimeDate = new Date(label.startTime);
  const endTimeDate = new Date(label.endTime);
  let reachedStartTime = false;
  let reachedEndTime = false;

  return (
    <TableRow
      key={`rulesetLabelRow-${label.id}`}
      className={`${styles.labelRow} ${isLast ? styles.lastLabel : ''}`}
      style={{
        top: `${4.9375 + labelNumber * 0.4}em`,
      }}
    >
      {columns.map((column, columnIndex) => {
        const key = `rulesetLabelRowCell-${label.id}-${columnIndex}-${column.id}`;

        if (columnIndex === 0) {
          return (
            <TableCell
              key={key}
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
              key={key}
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
            key={key}
            className={`${styles.labelCell} ${styles.label1}`}
          />
        );
      })}
    </TableRow>
  );
}
