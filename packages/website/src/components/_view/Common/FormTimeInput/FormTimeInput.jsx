import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import { useController, useFormContext } from 'react-hook-form';
import styles from './FormTimeInput.module.scss';

export default function FormTimeInput(props) {
  const { label, defaultValue, disabled } = props;
  const { control } = useFormContext();
  const useControllerProps = {
    ...props,
    control,
    defaultValue: defaultValue || '',
  };

  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid },
  } = useController(useControllerProps);

  return (
    <FormGroup className={styles.timeInput}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          disabled={disabled}
          ampm={false}
          disableOpenPicker
          id={name}
          name={name}
          value={value}
          label={label}
          disableIgnoringDatePartForTimeValidation
          inputFormat="HH"
          mask="__"
          views={['hours']}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          dateAdapter
          renderInput={(params) => (
            <TextField fullWidth {...params} error={!disabled && invalid} />
          )}
        />
      </LocalizationProvider>
    </FormGroup>
  );
}
