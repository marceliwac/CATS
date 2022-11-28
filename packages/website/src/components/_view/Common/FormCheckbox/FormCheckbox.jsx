import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import styles from './FormCheckbox.module.scss';

export default function FormCheckbox(props) {
  const { label, defaultHelperText, defaultValue, preserveHeight } = props;
  const { control } = useFormContext();
  const useControllerProps = {
    ...props,
    control,
    defaultValue: defaultValue || false,
  };

  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, error },
  } = useController(useControllerProps);

  const helperId = `${name}-helper-text`;
  const displayedDefaultHelperText =
    defaultHelperText || (preserveHeight ? ' ' : '');
  const helperTextMessage = error ? error.message : displayedDefaultHelperText;

  return (
    <div className={styles.checkbox}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          id={name}
          label={label}
          name={name}
          inputRef={ref}
          value={value}
          onChange={onChange}
          checked={value}
          onBlur={onBlur}
          aria-describedby={helperId}
        />
        <FormHelperText id={helperId} error={invalid}>
          {helperTextMessage}
        </FormHelperText>
      </FormGroup>
    </div>
  );
}
