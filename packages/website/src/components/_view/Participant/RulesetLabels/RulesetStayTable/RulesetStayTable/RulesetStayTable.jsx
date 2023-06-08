import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import styles from './RulesetStayTable.module.scss';
import RulesetTableSelectionToolbar from '../RulesetStayTableSelectionToolbar/RulesetStayTableSelectionToolbar';
import RulesetStayTableHeader from '../RulesetStayTableHeader/RulesetStayTableHeader';
import RulesetLabelRows from './RulesetLabelRows/RulesetLabelRows';

export default function RulesetStayTable(props) {
  const { title, labels, rows, columns } = props;

  return (
    <div className={styles.table}>
      {!!title && <RulesetTableSelectionToolbar title={title} />}
      <TableContainer className={styles.tableContainer}>
        <MuiTable aria-labelledby="tableTitle" size="medium" stickyHeader>
          <RulesetStayTableHeader labels={labels} columns={columns} />
          <TableBody>
            <RulesetLabelRows labels={labels} columns={columns} />
            {rows.map((row) => (
              <TableRow tabIndex={-1} key={row.id} className={styles.tableRow}>
                {columns.map((column, columnIndex) => {
                  let value = row[column.id];
                  if (['object', 'undefined'].includes(typeof value)) {
                    value = '';
                  }

                  const key = `rulesetStayTableCell-${columnIndex}-${row.id}-${column.id}`;

                  if (columnIndex === 0) {
                    return (
                      <TableCell
                        key={key}
                        align="left"
                        className={`${styles.parameterCell} ${styles.tableCell}`}
                      >
                        {value}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={key}
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
