import React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import styles from './HelpTip.module.scss';

const HTMLToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement="top-start" />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fafafa',
    color: '#666666',
    maxWidth: 220,
    fontSize: '.85em',
    lineHeight: 1.2,
    padding: '.7em',
    border: '1px solid #cccccc',
  },
}));

export default function HelpTip(props) {
  const { text } = props;

  return (
    <HTMLToolTip
      className={styles.tooltip}
      title={<p className={styles.text}>{text}</p>}
    >
      <div className={styles.icon}>
        <InfoOutlinedIcon fontSize="inherit" />
      </div>
    </HTMLToolTip>
  );
}
