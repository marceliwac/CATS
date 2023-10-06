import React from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import IconButton from '@mui/material/IconButton';
import styles from './Section.module.scss';

export default function Section(props) {
  const { title, children, isCollapsed: defaultIsCollapsed } = props;
  const [isCollapsed, setIsCollapsed] = React.useState(defaultIsCollapsed);

  function toggleCollapse() {
    setIsCollapsed((current) => !current);
  }

  return (
    <div className={styles.section}>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        <IconButton onClick={() => toggleCollapse()}>
          {(isCollapsed && <ExpandMoreRoundedIcon />) || (
            <ExpandLessRoundedIcon />
          )}
        </IconButton>
      </div>
      {!isCollapsed && <div className={styles.content}>{children}</div>}
    </div>
  );
}
