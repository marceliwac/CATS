import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import StartIcon from '@mui/icons-material/Start';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import Tooltip from '@mui/material/Tooltip';
import styles from './RulesetStayTableHeader.module.scss';

import useLabeller from '../../../../../../hooks/useLabeller';

function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
function formatTime(date) {
  return `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${
    date.getMinutes() < 10 ? '0' : ''
  }${date.getMinutes()}`;
}

export default function RulesetStayTableHeader(props) {
  const { columns, labels } = props;
  const displayBottomBorder = labels.length === 0;
  return (
    <TableHead>
      <TableRow
        className={`${styles.tableHeader} ${
          displayBottomBorder ? styles.bottomBorder : ''
        }`}
      >
        {columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return (
              <TableCell key="topLeft" className={styles.tableHeaderTopLeft} />
            );
          }

          const timestamp = column.id;
          const date = new Date(timestamp);
          const key = `${columnIndex}-${column.id}`;

          return (
            <TableCell
              key={key}
              align={column.numeric ? 'center' : 'left'}
              padding="none"
              className={styles.tableHeaderCell}
            >
              <div className={styles.header}>
                <div className={styles.dateTime}>
                  <span className={styles.date}>{formatDate(date)}</span>
                  <br />
                  <span className={styles.time}>{formatTime(date)}</span>
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
