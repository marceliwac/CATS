import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import styles from './StayTableHeader.module.scss';

function formatTableHeader(timestamp, selectDate) {
  const date = new Date(timestamp);
  return (
    // eslint-disable-next-line
    <div className={styles.header} onClick={() => selectDate(timestamp)}>
      <span className={styles.date}>
        {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
      </span>
      <br />
      <span className={styles.time}>
        {`${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${
          date.getMinutes() < 10 ? '0' : ''
        }${date.getMinutes()}`}
      </span>
    </div>
  );
}

export default function StayTableHeader(props) {
  const { columns, selectDate, displayBottomBorder } = props;

  return (
    <TableHead>
      <TableRow className={`${displayBottomBorder ? styles.bottomBorder : ''}`}>
        {columns.map((column, i) => {
          if (i === 0) {
            return (
              <TableCell key="topleft" className={styles.tableHeaderTopLeft} />
            );
          }
          return (
            <TableCell
              key={column.id}
              align={column.numeric ? 'center' : 'left'}
              padding="none"
              className={styles.tableHeaderCell}
            >
              {formatTableHeader(column.label, selectDate)}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
