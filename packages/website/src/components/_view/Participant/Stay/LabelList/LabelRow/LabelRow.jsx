import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './LabelRow.module.scss';
import useLabeller from '../../../../../../hooks/useLabeller';

export default function LabelRow(props) {
  const { label, number } = props;
  const { deleteLabel, getLabelClassName, formatDate } = useLabeller();

  return (
    <div
      className={`${styles.label} ${styles[getLabelClassName(number)]}`}
      key={label.id}
    >
      <div className={styles.color} />
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h2>Weaning takes place (label {number + 1})</h2>
          <Tooltip title="Delete this label">
            <IconButton onClick={() => deleteLabel(label.id)}>
              <ClearIcon className={styles.icon} />
            </IconButton>
          </Tooltip>
        </div>
        <p>
          <strong>Start time:</strong> {formatDate(label.startTime)}
        </p>
        <p>
          <strong>End time:</strong> {formatDate(label.endTime)}
        </p>
      </div>
    </div>
  );
}
