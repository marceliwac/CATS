import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import { useController, useFormContext } from 'react-hook-form';
import styles from './FormDateInput.module.scss';

export default function FormDateInput(props) {
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
    <FormGroup className={styles.dateInput}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          disabled={disabled}
          ampm={false}
          disableOpenPicker
          id={name}
          name={name}
          value={value}
          label={label}
          disableIgnoringDatePartForTimeValidation
          inputFormat="dd/MM/yyyy"
          mask="__/__/____"
          // views={['hours']}
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
