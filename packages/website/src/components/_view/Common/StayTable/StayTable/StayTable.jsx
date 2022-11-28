import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import styles from './StayTable.module.scss';
import TableSelectionToolbar from '../StayTableSelectionToolbar/StayTableSelectionToolbar';
import StayTableHeader from '../StayTableHeader/StayTableHeader';

function getLabelClassName(number) {
  const n = (number % 9) + 1;

  return styles[`label${n}`];
}

export default function StayTable(props) {
  const { title, rows, columns, topButtons, selectDate, labels } = props;

  function getLabelRows() {
    return labels.map((label, labelNumber) => {
      let reachedStartTime = false;
      let reachedEndTime = false;
      return (
        <TableRow key={label.id} className={styles.labelRow}>
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

  return (
    <div className={styles.table}>
      <TableSelectionToolbar title={title} topButtons={topButtons} />
      <TableContainer sx={{ maxHeight: '70vh' }}>
        <MuiTable aria-labelledby="tableTitle" size="medium" stickyHeader>
          <StayTableHeader columns={columns} selectDate={selectDate} />
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
                      align={column.numeric ? 'center' : 'left'}
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
