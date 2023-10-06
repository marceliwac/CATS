import React from 'react';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import styles from './RulesetStatus.module.scss';

export default function RulesetStatus(props) {
  const { status, bright } = props;
  let statusElement;

  switch (status) {
    case 'PENDING':
      statusElement = (
        <div className={styles.pending}>
          <AccessTimeOutlinedIcon />
          <p>Awaiting processing</p>
        </div>
      );
      break;
    case 'IN_PROGRESS':
      statusElement = (
        <div className={styles.inProgress}>
          <ChangeCircleOutlinedIcon />
          <p>Processing in progress</p>
        </div>
      );
      break;
    case 'COMPLETED':
      statusElement = (
        <div className={styles.completed}>
          <TaskAltIcon />
          <p>Processing complete</p>
        </div>
      );
      break;
    case 'FAILED':
      statusElement = (
        <div className={styles.failed}>
          <CancelOutlinedIcon />
          <p>Processing failed</p>
        </div>
      );
      break;
    default:
      statusElement = (
        <div className={styles.unknown}>
          <HelpOutlineOutlinedIcon />
          <p>Unknown status</p>
        </div>
      );
      break;
  }

  return (
    <div className={styles.status}>
      <div className={`${styles.statusWrapper} ${bright ? styles.bright : ''}`}>
        {statusElement}
      </div>
    </div>
  );
}
