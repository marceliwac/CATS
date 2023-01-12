import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import StartIcon from '@mui/icons-material/Start';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import styles from './StayTableHeader.module.scss';

import useLabeller from '../../../../../../hooks/useLabeller';

function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
function formatTime(date) {
  return `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${
    date.getMinutes() < 10 ? '0' : ''
  }${date.getMinutes()}`;
}

export default function StayTableHeader(props) {
  const {
    labels,
    startTimeDate,
    endTimeDate,
    isInSelectedRange,
    setStartTime,
    setEndTime,
  } = useLabeller();
  const { columns } = props;
  const displayBottomBorder = labels.length === 0;
  return (
    <TableHead>
      <TableRow
        className={`${styles.tableHeader} ${
          displayBottomBorder ? styles.bottomBorder : ''
        }`}
      >
        {columns.map((column, i) => {
          if (i === 0) {
            return (
              <TableCell key="topLeft" className={styles.tableHeaderTopLeft} />
            );
          }

          const timestamp = column.id;
          const date = new Date(timestamp);
          const inRange = isInSelectedRange(date, startTimeDate, endTimeDate);
          function selectStartTime() {
            if (endTimeDate && date > endTimeDate) {
              setEndTime(null);
            }
            setStartTime(timestamp);
          }
          function selectEndTime() {
            if (startTimeDate && date < startTimeDate) {
              setStartTime(null);
            }
            setEndTime(timestamp);
          }

          return (
            <TableCell
              key={column.id}
              align={column.numeric ? 'center' : 'left'}
              padding="none"
              className={styles.tableHeaderCell}
            >
              <div
                className={`${styles.header} ${inRange ? styles.inRange : ''}`}
              >
                <IconButton
                  className={styles.iconButton}
                  onClick={() => selectStartTime()}
                >
                  <StartIcon className={styles.icon} />
                </IconButton>
                <div className={styles.dateTime}>
                  <span className={styles.date}>{formatDate(date)}</span>
                  <br />
                  <span className={styles.time}>{formatTime(date)}</span>
                </div>
                <IconButton
                  className={styles.iconButton}
                  onClick={() => selectEndTime()}
                >
                  <KeyboardTabIcon className={styles.icon} />
                </IconButton>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
