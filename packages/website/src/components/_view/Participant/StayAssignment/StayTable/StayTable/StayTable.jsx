import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import styles from './StayTable.module.scss';
import TableSelectionToolbar from '../StayTableSelectionToolbar/StayTableSelectionToolbar';
import StayTableHeader from '../StayTableHeader/StayTableHeader';
import useLabeller from '../../../../../../hooks/useLabeller';
import LabelRows from './LabelRows/LabelRows';

export default function StayTable(props) {
  const { title, rows, columns } = props;
  const { startTimeDate, endTimeDate, isInSelectedRange } = useLabeller();

  return (
    <div className={styles.table}>
      {!!title && <TableSelectionToolbar title={title} />}
      <TableContainer className={styles.tableContainer}>
        <MuiTable aria-labelledby="tableTitle" size="medium" stickyHeader>
          <StayTableHeader columns={columns} />
          <TableBody>
            <LabelRows columns={columns} />
            {rows.map((row) => (
              <TableRow tabIndex={-1} key={row.id} className={styles.tableRow}>
                {columns.map((column, columnIndex) => {
                  const timestamp = column.id;
                  const date = new Date(timestamp);
                  let value = row[column.id];
                  if (['object', 'undefined'].includes(typeof value)) {
                    value = '';
                  }
                  const inRange = isInSelectedRange(
                    date,
                    startTimeDate,
                    endTimeDate
                  );

                  if (columnIndex === 0) {
                    return (
                      <TableCell
                        key={`${row.id}-${column.id}`}
                        align="left"
                        className={`${styles.parameterCell} ${
                          styles.tableCell
                        } ${inRange ? styles.inRange : ''}`}
                      >
                        {value}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      align="right"
                      className={`${styles.valueCell} ${styles.tableCell} ${
                        inRange ? styles.inRange : ''
                      }`}
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
