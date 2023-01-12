import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import styles from './LabelRow.module.scss';
import useLabeller from '../../../../../../hooks/useLabeller';

export default function LabelRow(props) {
  const { label, number } = props;
  const { deleteLabel, getLabelNumber, formatDate } = useLabeller();
  let confidence = '-';
  let parameters = '-';
  const labelType = label.additionalData.labelType;
  const labelClassBaseName =
    label.additionalData.labelType === 'general' ? 'label' : 'labelOther';
  const labelClassName =
    styles[`${labelClassBaseName}${getLabelNumber(number)}`];

  if (label.additionalData) {
    if (typeof label.additionalData.confidence === 'number') {
      const confidenceValue = Number.parseFloat(
        label.additionalData.confidence * 100
      ).toFixed(0);
      confidence = `${confidenceValue}%`;
    }

    if (Array.isArray(label.additionalData.parameters)) {
      parameters = label.additionalData.parameters.map((parameter) => (
        <span className={styles.parameterList} key={parameter.name}>
          <br />- {parameter.label}{' '}
          {parameter.value ? (
            <em>({parameter.value})</em>
          ) : (
            <em>(no explanation)</em>
          )}
        </span>
      ));
    }
  }

  return (
    <div className={`${styles.label} ${labelClassName}`} key={label.id}>
      <div className={styles.color} />
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h2>
            Weaning ({labelType}, label {number + 1})
          </h2>
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
        <p>
          <strong>Confidence:</strong> {confidence}
        </p>
        <p>
          <strong>Parameters:</strong> {parameters}
        </p>
      </div>
    </div>
  );
}
