import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LabelList.module.scss';
import useLabeller from '../../../../../hooks/useLabeller';
import LabelRow from './LabelRow/LabelRow';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';
import CurrentLabel from './CurrentLabel/CurrentLabel';

export default function LabelList(props) {
  const { parameters } = props;
  const { labels, isCreatingLabel, toggleIsCreatingLabel } = useLabeller();
  const [formAlert, setFormAlert] = React.useState(null);
  const { stayAssignmentId } = useParams();
  const navigate = useNavigate();

  const onSubmit = React.useCallback(async () => {
    try {
      const data = labels.map((label) => ({
        startTime: label.startTime,
        endTime: label.endTime,
        additionalData: label.additionalData,
      }));
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
        navigate('/participant/stayAssignments?navigateToNext=true');
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

  return (
    <>
      {formAlert && <FormAlert alert={formAlert} />}

      {labels.length === 0 && (
        <p className={styles.noLabels}>You have not created any labels yet.</p>
      )}
      <div className={styles.labelList}>
        <div className={styles.labels}>
          {labels.map((label, labelNumber) => (
            <LabelRow key={label.id} label={label} number={labelNumber} />
          ))}

          {(isCreatingLabel && <CurrentLabel parameters={parameters} />) || (
            <Button variant="outlined" onClick={toggleIsCreatingLabel}>
              Create new label
            </Button>
          )}
        </div>

        <div className={styles.buttonRow}>
          <Button variant="contained" color="success" onClick={onSubmit}>
            {(labels.length > 0 &&
              `Mark as labelled (${labels.length} label${
                labels.length !== 1 ? 's' : ''
              })`) ||
              'Mark as labelled (no labels needed)'}
          </Button>
        </div>
      </div>
    </>
  );
}
