import React from 'react';
import Button from '@mui/material/Button';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import styles from './RulesetStayTableSelectionToolbar.module.scss';

export default function RulesetStayTableSelectionToolbar(props) {
  const { title, topButtons } = props;

  return (
    <div className={styles.tableSelectionToolbar}>
      <>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.spacer} />
        {topButtons && (
          <div className={styles.buttonGroup}>
            {topButtons.map((button, i) => (
              <Button
                key={button.label}
                variant={button.variant || 'contained'}
                disabled={button.handler === null}
                onClick={button.handler === null ? () => {} : button.handler}
              >
                {button.icon && (
                  <span className={styles.icon}>{button.icon}</span>
                )}
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </>
    </div>
  );
}
