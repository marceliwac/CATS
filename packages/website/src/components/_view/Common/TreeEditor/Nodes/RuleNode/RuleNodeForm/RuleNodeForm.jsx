import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {
  InputAdornment,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  ListItemIcon,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import { ContentPaste } from '@mui/icons-material';
import styles from './RuleNodeForm.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import usePostInitDebouncing from '../../../../../../../hooks/usePostInitDebouncing';
import TreeEditorConfig from '../../../TreeEditorConfig';
import useDidMount from '../../../../../../../hooks/useDidMount';

const {
  rule: {
    operationOptionsValue,
    operationOptionsSelection,
    parameterOptions,
    parameterSelection,
    noValueOperations,
  },
} = TreeEditorConfig;

function getParameterUnitByOptionValue(value) {
  const matchingParameterOptions = parameterOptions.filter(
    (option) => option.value === value
  );
  return matchingParameterOptions.length > 0
    ? matchingParameterOptions[0].unit
    : '';
}

function getOptionLabel(value, hasValueOptions) {
  const matchingParameterOptions = hasValueOptions
    ? operationOptionsSelection.filter((option) => option.value === value)
    : operationOptionsValue.filter((option) => option.value === value);
  return matchingParameterOptions.length > 0
    ? matchingParameterOptions[0].label
    : '';
}

export default function RuleNodeForm(props) {
  const { id, operation, parameter, value, setError, isEditable } = props;
  const [operationInput, setOperationInput] = React.useState(operation);
  const [parameterInput, setParameterInput] = React.useState(parameter);
  const [valueInput, setValueInput] = React.useState(value);
  const [valueOptions, setValueOptions] = React.useState(null);
  const [valueUnit, setValueUnit] = React.useState('');
  const { isNumeric, updateNode, setHasError } = useTreeEditor();
  const didMount = useDidMount();
  const [valueError, setValueError] = React.useState(false);
  const [parameterError, setParameterError] = React.useState(false);

  usePostInitDebouncing(() => {
    updateNode(id, {
      parameter: parameterInput,
      operation: operationInput,
      value: valueInput,
    });
  }, [id, operationInput, parameterInput, valueInput]);

  React.useEffect(() => {
    const vError =
      valueInput === '' && !noValueOperations.includes(operationInput);
    const pError = parameterInput === '';
    setValueError(vError);
    setParameterError(pError);
    setError(vError || pError);
    setHasError(vError || pError);
  }, [operationInput, parameterInput, setError, valueInput, setHasError]);

  React.useEffect(() => {
    if (didMount) {
      if (Object.keys(parameterSelection).includes(parameterInput)) {
        const newValueOptions = parameterSelection[parameterInput];
        setValueOptions(newValueOptions);
        const newValueOptionValues = newValueOptions.map(
          (option) => option.value
        );
        setValueInput((currentValueInput) => {
          if (Array.isArray(currentValueInput)) {
            return currentValueInput
              .map((option) =>
                newValueOptionValues.includes(option) ? option : null
              )
              .filter((option) => option !== null);
          }
          return [];
        });
        setValueUnit('');
        if (
          !operationOptionsSelection.map((op) => op.value).includes(operation)
        ) {
          setOperationInput(operationOptionsSelection[0].value);
        }
      } else {
        setValueOptions(null);
        setValueInput((current) =>
          isNumeric(current) ? `${parseFloat(current)}` : ''
        );
        setValueUnit(getParameterUnitByOptionValue(parameterInput));
      }
    }
  }, [isNumeric, operation, didMount, parameterInput]);

  return (
    <div className={styles.ruleNodeForm}>
      <div className={styles.row}>
        <FormControl
          sx={{ m: 1 }}
          className={styles.parameterDropdown}
          error={parameterError}
          disabled={!isEditable}
        >
          <InputLabel id={`${id}-parameter-label`}>
            {parameterError ? 'Parameter needed' : 'Parameter'}
          </InputLabel>
          <Select
            className={styles.select}
            labelId={`${id}-parameter-label`}
            id={`${id}-parameter`}
            label={parameterError ? 'Parameter needed' : 'Parameter'}
            value={parameterInput}
            onChange={(e) => setParameterInput(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 10.5 + 8,
                },
              },
            }}
          >
            {parameterOptions.map((option) => (
              <MenuItem
                key={`${id}-parameter-${option.value}`}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.row}>
        <FormControl
          sx={{ m: 1 }}
          className={styles.operationDropdown}
          disabled={!isEditable}
        >
          <InputLabel id={`${id}-operation-label`}>Must be</InputLabel>
          <Select
            className={styles.select}
            labelId={`${id}-operation-label`}
            id={`${id}-operation`}
            label="Must be"
            value={operationInput}
            onChange={(e) => setOperationInput(e.target.value)}
            renderValue={(selected) =>
              getOptionLabel(selected, valueOptions !== null)
            }
          >
            {(valueOptions !== null
              ? operationOptionsSelection
              : operationOptionsValue
            ).map((option) => (
              <MenuItem
                key={`${id}-operation-${option.value}`}
                value={option.value}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(valueOptions !== null && (
          <FormControl
            sx={{ m: 1 }}
            className={styles.valueInput}
            disabled={!isEditable}
          >
            <InputLabel id={`${id}-value-label`}>Value</InputLabel>
            <Select
              className={styles.select}
              labelId={`${id}-value-label`}
              id={`${id}-value`}
              label="Value"
              multiple
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return '(none selected)';
                }
                return `(${selected.length}) ${selected.join(', ')}`;
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 10.5 + 8,
                  },
                },
              }}
            >
              {valueOptions.map((option) => (
                <MenuItem
                  key={`${id}-value-${option.value}`}
                  value={option.value}
                >
                  <Checkbox checked={valueInput.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )) ||
          (!noValueOperations.includes(operationInput) && (
            <FormControl
              sx={{ m: 1 }}
              className={styles.valueInput}
              error={valueError}
              disabled={!isEditable}
            >
              <InputLabel id={`${id}-value-label-input`}>
                {valueError ? 'Value needed' : 'Value'}
              </InputLabel>
              <OutlinedInput
                className={styles.input}
                id={`${id}-value-input`}
                label={valueError ? 'Value needed' : 'Value'}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">{valueUnit}</InputAdornment>
                }
              />
            </FormControl>
          ))}
      </div>
    </div>
  );
}
