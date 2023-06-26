import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import styles from '../RulesetStayTable.module.scss';

export default function RulesetLabelRow(props) {
  const { columns, labels } = props;
  function isWithinOneOfLabels(charttime) {
    for (let i = 0; i < labels.length; i += 1) {
      if (charttime >= labels[i].startTime && charttime <= labels[i].endTime) {
        return true;
      }
    }
    return false;
  }

  return (
    <TableRow
      key="rulesetLabelRow"
      className={`${styles.labelRow} ${styles.lastLabel}`}
      style={{
        top: `${4.9375}em`,
      }}
    >
      {columns.map((column, columnIndex) => {
        const key = `rulesetLabelRowCell-${columnIndex}-${column.id}`;

        if (columnIndex === 0) {
          return (
            <TableCell
              key={key}
              className={`${styles.parameterCell} ${styles.labelCell}`}
            />
          );
        }

        return (
          <TableCell
            key={key}
            className={`${styles.labelCell} ${
              isWithinOneOfLabels(column.id)
                ? `${styles.label} ${styles.inRange}`
                : styles.nonLabel
            }`}
          />
        );
      })}
    </TableRow>
  );
}
