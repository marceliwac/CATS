import React from 'react';
import TextField from '@mui/material/TextField';
import styles from './ParameterInputBox.module.scss';

export default function ParameterInputBox(props) {
  const { name, value, label, updateField } = props;
  return (
    <div className={styles.field}>
      <p className={styles.label}>{label}</p>
      {/* <input */}
      {/*  className={styles.input} */}
      {/*  value={value} */}
      {/*  onChange={(e) => updateField(name, e.target.value)} */}
      {/* /> */}
      <TextField
        className={styles.input}
        value={value}
        onChange={(e) => updateField(name, e.target.value)}
        label="Explanation (optional)"
        placeholder="How this parameter contributes to label..."
        multiline
      />
    </div>
  );
}
