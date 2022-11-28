import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import styles from './TableSelectionToolbar.module.scss';

export default function TableSelectionToolbar(props) {
  const { title, selected, selectedActions, topButtons, clearSelected } = props;
  const selectedCount = selected.length;

  return (
    <div className={styles.tableSelectionToolbar}>
      <>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.spacer} />
        {(selectedCount > 0 && (
          <>
            <p className={styles.countIndicator}>{selectedCount} selected</p>
            {selectedActions && (
              <div className={styles.buttonGroup}>
                {selectedActions.map((selectedAction) => (
                  <Tooltip
                    title={selectedAction.label}
                    key={selectedAction.label}
                  >
                    <IconButton
                      onClick={() => {
                        selectedAction.handler(selected);
                        if (selectedAction.clearSelectionAfterAction) {
                          clearSelected();
                        }
                      }}
                    >
                      {selectedAction.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </div>
            )}
          </>
        )) || (
          <>
            {topButtons && (
              <div className={styles.buttonGroup}>
                {topButtons.map((button, i) => (
                  <Button
                    key={button.label}
                    variant={
                      button.variant || i === 0 ? 'contained' : 'outlined'
                    }
                    disabled={button.handler === null}
                    onClick={
                      button.handler === null ? () => {} : button.handler
                    }
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}
