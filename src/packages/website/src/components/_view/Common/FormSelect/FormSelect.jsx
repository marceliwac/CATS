import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import styles from './FormSelect.module.scss';

export default function FormSelect(props) {
  const {
    label,
    defaultHelperText,
    options,
    defaultOption,
    preserveHeight,
    variant,
    size,
    rules,
  } = props;
  const { control } = useFormContext();
  const useControllerProps = {
    ...props,
    control,
    defaultValue: defaultOption ? defaultOption.value : '',
    rules,
  };

  const {
    field: { onChange, name, value },
    fieldState: { invalid, error },
  } = useController(useControllerProps);

  const helperId = `${name}-helper-text`;
  const labelId = `${name}-label`;
  const displayedDefaultHelperText =
    defaultHelperText || (preserveHeight ? ' ' : '');
  const helperTextMessage = error ? error.message : displayedDefaultHelperText;

  /* eslint-disable react/jsx-wrap-multilines */

  return (
    <div className={styles.select}>
      <FormControl variant={variant || 'outlined'}>
        {label && (
          <InputLabel error={invalid} id={labelId}>
            {label}
          </InputLabel>
        )}
        <Select
          aria-describedby={helperId}
          labelId={labelId}
          size={size || 'normal'}
          label={label}
          value={value}
          error={invalid}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              className={styles.option}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={invalid} id={helperId}>
          {helperTextMessage}
        </FormHelperText>
      </FormControl>
    </div>
  );
}
