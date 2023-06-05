import React from 'react';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import styles from './RowTable.module.scss';

export default function RowTable(props) {
  const navigate = useNavigate();
  const { dataKey, lowerInterval, upperInterval } = props;

  return (
    <div className={styles.rowTable}>
      <div className={styles.tableRow}>
        <p className={styles.separator}>Top and bottom rows</p>
      </div>

      {lowerInterval.map(({ index, stayId, value }) => (
        <div className={styles.tableRow} key={`${dataKey}-lower-${index}`}>
          <p className={styles.index}>{index}.</p>
          <p className={styles.value}>{value.toFixed(3)}</p>
          <div className={styles.button}>
            <IconButton onClick={() => navigate(`stayId/${stayId}`)}>
              <LaunchIcon />
            </IconButton>
          </div>
        </div>
      ))}

      <div className={styles.tableRow}>
        <p className={styles.separator}>...</p>
      </div>

      {upperInterval.map(({ index, stayId, value }) => (
        <div className={styles.tableRow} key={`${dataKey}-upper-${index}`}>
          <p className={styles.index}>{index}.</p>
          <p className={styles.value}>{value.toFixed(3)}</p>
          <div className={styles.button}>
            <IconButton onClick={() => navigate(`stayId/${stayId}`)}>
              <LaunchIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
