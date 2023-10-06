import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { ListItemText, OutlinedInput } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import styles from './ParameterSelector.module.scss';
import ParameterInputBox from './ParameterInputBox/ParameterInputBox';

export default function ParameterSelector(props) {
  const {
    parameters,
    selectedParameters,
    handleChange,
    parameterFields,
    setParameterFields,
  } = props;

  const selectOptions = parameters.map((parameter) => ({
    key: parameter.key,
    value: parameter.key,
    label: parameter.label,
  }));

  const updateField = React.useCallback(
    (fieldName, value) => {
      setParameterFields((currentFields) => {
        const newFields = [...currentFields];
        newFields.filter((field) => field.name === fieldName)[0].value = value;
        return newFields;
      });
    },
    [setParameterFields]
  );

  React.useEffect(() => {
    setParameterFields((currentFields) => {
      const existingFields = currentFields.filter((field) =>
        selectedParameters.includes(field.name)
      );
      const includedFields = existingFields.map((field) => field.name);
      const newFields = selectedParameters.filter(
        (field) => !includedFields.includes(field)
      );
      return [
        ...existingFields,
        ...newFields.map((field) => ({
          name: field,
          label: field.split('_').join(' '),
          value: '',
        })),
      ];
    });
  }, [selectedParameters, setParameterFields]);

  return (
    <div className={styles.parameterSelector}>
      <FormControl sx={{ m: 1, width: 300 }} className={styles.selector}>
        <InputLabel id="parameters-checkbox-label">Parameters</InputLabel>
        <Select
          labelId="parameters-checkbox-label"
          id="parameters-checkbox"
          multiple
          value={selectedParameters}
          onChange={handleChange}
          input={<OutlinedInput label="Parameters" />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return 'None selected';
            }
            return `${selected.length} selected (${selected
              .map((p) => p.split('_').join(' '))
              .join(', ')})`;
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 10.5 + 8,
                width: 250,
              },
            },
          }}
        >
          {selectOptions.map((option) => (
            <MenuItem key={option.key} value={option.value}>
              <Checkbox
                checked={selectedParameters.indexOf(option.value) > -1}
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className={styles.parameters}>
        {parameterFields.map((field) => (
          <ParameterInputBox
            key={field.name}
            name={field.name}
            label={field.label}
            value={field.value}
            updateField={updateField}
          />
        ))}
      </div>
    </div>
  );
}
