import React from 'react';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import styles from './CurrentLabelField.module.scss';
import useLabeller from '../../../../../../../hooks/useLabeller';

export default function CurrentLabelField(props) {
  const { formatDate } = useLabeller();
  const { title, date, isWarning } = props;

  return (
    <div className={styles.field}>
      <h4>{title}: </h4>
      {(date && <p>{formatDate(date)}</p>) || (
        <div
          className={`${styles.noDate} ${isWarning ? styles.isWarning : ''}`}
        >
          <p>not {!isWarning ? 'yet ' : ''}selected</p>
          <div className={styles.icon}>
            <ErrorOutlineOutlinedIcon />
          </div>
        </div>
      )}
    </div>
  );
}
