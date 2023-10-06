import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import styles from './FormAlert.module.scss';

export default function FormAlert(props) {
  const { alert } = props;

  return (
    <div className={styles.alert}>
      <Alert severity={alert.severity}>
        {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
        {alert.message}
      </Alert>
    </div>
  );
}
