import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ReplayIcon from '@mui/icons-material/ReplayRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { Slider } from '@mui/material';
import Button from '@mui/material/Button';
import Form from '../../../../Common/Form/Form';
import useLabeller from '../../../../../../hooks/useLabeller';
import styles from '../LabelList.module.scss';
import ParameterSelector from './ParameterSelector/ParameterSelector';

const confidenceLabelMarks = [
  {
    value: 0,
    label: <p className={styles.mark}>Not confident</p>,
  },
  {
    value: 1,
    label: <p className={styles.mark}>Very confident</p>,
  },
];
export default function CurrentLabel(props) {
  const { parameters } = props;

  const {
    currentLabel,
    saveLabel: saveLabelInLabeller,
    resetLabel,
    toggleIsCreatingLabel,
    formatDate,
  } = useLabeller();

  const [confidence, setConfidence] = React.useState(0.5);

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

  function saveLabel() {
    saveLabelInLabeller(confidence);
  }

  return (
    <Form>
      <div className={styles.currentSelection}>
        <div className={styles.topRow}>
          <h2>(New label)</h2>
          <div className={styles.topRowButtons}>
            <IconButton onClick={resetLabel}>
              <Tooltip title="Reset current label">
                <ReplayIcon className={styles.icon} />
              </Tooltip>
            </IconButton>
            <IconButton onClick={toggleIsCreatingLabel}>
              <Tooltip title="Cancel">
                <CloseIcon className={styles.icon} />
              </Tooltip>
            </IconButton>
          </div>
        </div>

        <div className={`${styles.horizontalSection} ${styles.section}`}>
          <div className={styles.halfSection}>
            <h3>Current selection:</h3>
            <div className={styles.selection}>
              <div className={styles.field}>
                {getCurrentLabelStartTime() || (
                  <p className={styles.noDate}>not selected</p>
                )}
              </div>
              <p className={styles.fieldSeparator}>-</p>
              <div className={styles.field}>
                {getCurrentLabelEndTime() || (
                  <p className={styles.noDate}>not selected</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.halfSection}>
            <h3>Confidence:</h3>
            <div className={styles.slider}>
              <Slider
                aria-label="Confidence in label"
                defaultValue={confidence}
                value={confidence}
                onChange={(e, v) => setConfidence(v)}
                min={0}
                max={1}
                getAriaValueText={(value) => `${value}%`}
                step={0.01}
                valueLabelDisplay="auto"
                marks={confidenceLabelMarks}
              />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h3>Parameters suggesting label:</h3>
          <ParameterSelector parameters={parameters} />
        </div>
        <div className={styles.buttons}>
          <Button variant="contained" onClick={() => saveLabel()}>
            Save label
          </Button>
        </div>
      </div>
    </Form>
  );
}
