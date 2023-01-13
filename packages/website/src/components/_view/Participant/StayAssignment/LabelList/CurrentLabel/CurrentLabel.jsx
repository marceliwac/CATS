import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ReplayIcon from '@mui/icons-material/ReplayRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { Slider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CurrentLabelField from './CurrentLabelField/CurrentLabelField';
import ParameterSelector from './ParameterSelector/ParameterSelector';
import styles from '../LabelList.module.scss';
import useLabeller from '../../../../../../hooks/useLabeller';
import Form from '../../../../Common/Form/Form';
import HelpTip from '../../../../Common/HelpTip/HelpTip';

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

const DEFAULT_CONFIDENCE = 0.5;

export default function CurrentLabel(props) {
  const { parameters } = props;

  const {
    startTimeDate,
    endTimeDate,
    saveLabel: saveLabelInLabeller,
    resetLabel: resetLabelInLabeller,
    toggleIsCreatingLabel,
  } = useLabeller();

  const isWarning = startTimeDate || endTimeDate;

  const [confidence, setConfidence] = React.useState(DEFAULT_CONFIDENCE);
  const [selectedParameters, setSelectedParameters] = React.useState([]);
  const [parameterFields, setParameterFields] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedParameters(typeof value === 'string' ? value.split(',') : value);
  };

  function resetLabel() {
    setSelectedParameters([]);
    setParameterFields([]);
    setConfidence(DEFAULT_CONFIDENCE);
    resetLabelInLabeller();
  }

  function saveLabel() {
    setIsSubmitting(true);
    try {
      saveLabelInLabeller({
        confidence,
        parameters: parameterFields,
      });
      setErrorMessage(null);
    } catch (e) {
      setIsSubmitting(false);
      setErrorMessage(e.message);
    }
  }

  return (
    <Form>
      <div className={styles.currentSelection}>
        <div className={styles.topRow}>
          <h2>(New label)</h2>
          <div className={styles.topRowButtons}>
            <IconButton onClick={() => resetLabel()}>
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
            <h3>
              Current selection
              <HelpTip text="To select start and end dates, hover over the date in the table header you wish to select, and press the corresponding button. Pressing the left button will mark the date as the start date, and the right button will mark it an end date. You may wish to select the same date as both the start and end date." />
            </h3>
            <div className={styles.fields}>
              <CurrentLabelField
                title="From"
                date={startTimeDate}
                isWarning={isWarning}
              />
              <CurrentLabelField
                title="To"
                date={endTimeDate}
                isWarning={isWarning}
              />
            </div>
          </div>
          <div className={styles.halfSection}>
            <h3>
              Confidence
              <HelpTip text="To improve the effectiveness of your label, use the confidence slider to indicate how certain you are of the label correctness." />
            </h3>
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
          <h3>
            Parameters suggesting label{' '}
            <HelpTip text="You can choose to select any number of parameters to help explain why this label should be applied." />
          </h3>
          <ParameterSelector
            parameters={parameters}
            selectedParameters={selectedParameters}
            handleChange={handleSelectChange}
            parameterFields={parameterFields}
            setParameterFields={setParameterFields}
          />
        </div>
        <div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </div>
        <div className={styles.buttons}>
          <LoadingButton
            variant="contained"
            onClick={() => saveLabel()}
            loading={isSubmitting}
          >
            <span>Save label</span>
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
