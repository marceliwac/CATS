import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import styles from './StayTable.module.scss';
import TableSelectionToolbar from '../StayTableSelectionToolbar/StayTableSelectionToolbar';
import StayTableHeader from '../StayTableHeader/StayTableHeader';
import useLabeller from '../../../../../hooks/useLabeller';

function getLabelClassName(number) {
  const n = (number % 9) + 1;

  return styles[`label${n}`];
}

export default function StayTable(props) {
  const { title, rows, columns } = props;
  const { labels, addDateToLabel } = useLabeller();

  function getLabelRows() {
    return labels.map((label, labelNumber, labelArray) => {
      let reachedStartTime = false;
      let reachedEndTime = false;
      return (
        <TableRow
          key={label.id}
          className={`${styles.labelRow} ${
            labelNumber === labelArray.length - 1 ? styles.lastLabel : ''
          }`}
          style={{
            top: `${4.75 + labelNumber * 0.4}em`,
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

            if (label.startTime === column.label) {
              reachedStartTime = true;
            }

            if (reachedEndTime || !reachedStartTime) {
              return (
                <TableCell
                  key={`${label.id}-${column.id}`}
                  className={styles.labelCell}
                />
              );
            }

            if (label.endTime === column.label) {
              reachedEndTime = true;
            }

            return (
              <TableCell
                key={`${label.id}-${column.id}`}
                className={`${styles.labelCell} ${getLabelClassName(
                  labelNumber
                )}`}
              />
            );
          })}
        </TableRow>
      );
    });
  }

  // TODO: Make the dates selectable based on the value of the isCreatingLabel from the useLabeller hook.

  return (
    <div className={styles.table}>
      {!!title && <TableSelectionToolbar title={title} />}
      <TableContainer className={styles.tableContainer}>
        <MuiTable aria-labelledby="tableTitle" size="medium" stickyHeader>
          <StayTableHeader
            columns={columns}
            selectDate={addDateToLabel}
            displayBottomBorder={labels.length === 0}
          />
          <TableBody>
            {getLabelRows()}
            {rows.map((row) => (
              <TableRow tabIndex={-1} key={row.id} className={styles.tableRow}>
                {columns.map((column, columnIndex) => {
                  let value = row[column.id];
                  if (['object', 'undefined'].includes(typeof value)) {
                    value = '';
                  }

                  if (columnIndex === 0) {
                    return (
                      <TableCell
                        key={`${row.id}-${column.id}`}
                        align="left"
                        className={`${styles.parameterCell} ${styles.tableCell}`}
                      >
                        {value}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      align="right"
                      className={`${styles.valueCell} ${styles.tableCell}`}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
}
