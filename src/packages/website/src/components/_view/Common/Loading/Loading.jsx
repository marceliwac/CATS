import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Loading.module.scss';

const DEFAULT_LABEL = 'Loading...';

export default function Loading(props) {
  const { message } = props;
  return (
    <div className={styles.loading}>
      <CircularProgress />
      <p>{message || DEFAULT_LABEL}</p>
    </div>
  );
}
