import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import styles from './FormTextField.module.scss';

export default function FormTextField(props) {
  const {
    label,
    defaultHelperText,
    defaultValue,
    preserveHeight,
    autocomplete,
    disabled,
    variant,
    multiline,
    size,
    type,
  } = props;
  const { control } = useFormContext();
  const useControllerProps = {
    ...props,
    control,
    defaultValue: defaultValue || '',
  };

  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, error },
  } = useController(useControllerProps);

  const displayedDefaultHelperText =
    defaultHelperText || (preserveHeight ? ' ' : '');
  const helperTextMessage = error ? error.message : displayedDefaultHelperText;

  return (
    <div className={styles.textField}>
      <TextField
        id={name}
        label={label}
        variant={variant || 'outlined'}
        size={size || 'normal'}
        name={name}
        inputRef={ref}
        value={value}
        onChange={onChange}
        type={type}
        onBlur={onBlur}
        error={invalid}
        autoComplete={autocomplete}
        helperText={helperTextMessage}
        multiline={multiline}
        disabled={disabled}
        fullWidth
      />
    </div>
  );
}
