import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import styles from './FormRadioButtonGroup.module.scss';

export default function FormRadioButtonGroup(props) {
  const {
    label,
    defaultHelperText,
    defaultValue,
    preserveHeight,
    values,
    disabled,
  } = props;
  const { control } = useFormContext();
  const useControllerProps = {
    ...props,
    control,
    defaultValue: defaultValue || false,
  };

  const {
    field: { onChange, name, value },
    fieldState: { invalid, error },
  } = useController(useControllerProps);

  const helperId = `${name}-helper-text`;
  const labelId = `${name}-label`;
  const displayedDefaultHelperText =
    defaultHelperText || preserveHeight ? ' ' : '';
  const helperTextMessage = error ? error.message : displayedDefaultHelperText;

  return (
    <div className={styles.radioButtonGroup}>
      <FormGroup>
        <FormLabel id={labelId} className={styles.label}>
          {label}
        </FormLabel>
        <RadioGroup
          defaultValue={defaultValue}
          name={name}
          value={value}
          onChange={onChange}
          aria-describedby={helperId}
          aria-labelledby={labelId}
        >
          {values.map((v) => (
            <FormControlLabel
              key={`radio-${name}-${v.name}`}
              value={v.name}
              control={<Radio />}
              label={v.label}
              disabled={disabled || v.disabled}
            />
          ))}
        </RadioGroup>
        <FormHelperText id={helperId} error={invalid}>
          {helperTextMessage}
        </FormHelperText>
      </FormGroup>
    </div>
  );
}
