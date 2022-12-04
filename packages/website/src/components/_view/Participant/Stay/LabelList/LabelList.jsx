import React from 'react';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LabelList.module.scss';
import useLabeller from '../../../../../hooks/useLabeller';
import LabelRow from './LabelRow/LabelRow';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function LabelList() {
  const {
    currentLabel,
    labels,
    saveLabel,
    resetLabel,
    isCreatingLabel,
    toggleIsCreatingLabel,
    formatDate,
  } = useLabeller();

  const [formAlert, setFormAlert] = React.useState(null);
  const { stayAssignmentId } = useParams();
  const navigate = useNavigate();

  const onSubmit = React.useCallback(async () => {
    try {
      const data = {
        labels: labels.map((label) => ({
          startTime: label.startTime,
          endTime: label.endTime,
          // additionalData: {},
        })),
      };
      await APIClient.post(
        `/participant/stayAssignments/${stayAssignmentId}/labels`,
        data
      );
      setFormAlert({
        severity: 'success',
        title: 'Labels submitted successfully!',
        message:
          'The data annotation for this entry has been saved. You will be redirected to the next assigned data entry shortly.',
      });
      setTimeout(() => {
        navigate('/participant/stays?navigateToNext=true');
      }, 2000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not submit labels!',
        message:
          'Something went wrong during the label submission. Please contact the administrator for further support.',
      });
    }
  }, [labels, stayAssignmentId, navigate]);

  const getCurrentLabelStartTime = React.useCallback(() => {
    if (currentLabel.length === 0) {
      return null;
    }
    if (currentLabel.length === 1 || currentLabel[0] < currentLabel[1]) {
      return <p>{formatDate(currentLabel[0])}</p>;
    }
    return <p>{formatDate(currentLabel[1])}</p>;
  }, [currentLabel, formatDate]);

  const getCurrentLabelEndTime = React.useCallback(() => {
    if (currentLabel.length === 0 || currentLabel.length === 1) {
      return null;
    }
    if (currentLabel[0] < currentLabel[1]) {
      return <p>{formatDate(currentLabel[1])}</p>;
    }
    return <p>{formatDate(currentLabel[0])}</p>;
  }, [currentLabel, formatDate]);

  return (
    <>
      {formAlert && <FormAlert alert={formAlert} />}

      <div className={styles.labelList}>
        <div className={styles.labels}>
          {labels.map((label, labelNumber) => (
            <LabelRow key={label.id} label={label} number={labelNumber} />
          ))}

          {(isCreatingLabel && (
            <div className={styles.currentSelection}>
              <div className={styles.topRow}>
                <h2>(New label)</h2>
                <IconButton onClick={resetLabel}>
                  <Tooltip title="Reset current label">
                    <ReplayIcon className={styles.icon} />
                  </Tooltip>
                </IconButton>
              </div>
              <h3>Current selection:</h3>
              <div className={styles.selection}>
                <div className={styles.field}>
                  {getCurrentLabelStartTime() || (
                    <p className={styles.noDate}>not selected</p>
                  )}
                </div>
                <p>-</p>
                <div className={styles.field}>
                  {getCurrentLabelEndTime() || (
                    <p className={styles.noDate}>not selected</p>
                  )}
                </div>
              </div>

              <div className={styles.buttons}>
                <Button variant="contained" onClick={saveLabel}>
                  Save label
                </Button>
              </div>
            </div>
          )) || (
            <Button variant="outlined" onClick={toggleIsCreatingLabel}>
              Create new label
            </Button>
          )}
        </div>

        <div className={styles.buttonRow}>
          <Button
            variant={labels.length > 0 ? 'contained' : 'outlined'}
            color="success"
            onClick={onSubmit}
          >
            Submit ({labels.length} label{labels.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </div>
    </>
  );
}
