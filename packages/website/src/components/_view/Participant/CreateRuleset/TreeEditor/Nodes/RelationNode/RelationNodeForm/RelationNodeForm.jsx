import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { OutlinedInput } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import styles from '../../../../../StayAssignment/LabelList/CurrentLabel/ParameterSelector/ParameterSelector.module.scss';
import useTreeEditor from '../../../../../../../../hooks/useTreeEditor';

const operationOptions = [
  {
    value: 'OR',
    label: 'At least one rule matches',
  },
  {
    value: 'AND',
    label: 'All rules must match',
  },
];

export default function RelationNodeForm(props) {
  const { id, operation } = props;
  const [operationInput, setOperationInput] = React.useState(operation);
  const { updateNode } = useTreeEditor();

  React.useEffect(() => {
    updateNode(id, { operation: operationInput });
  }, [id, operationInput, updateNode]);
  return (
    <div className={styles.relationNodeForm}>
      <FormControl sx={{ m: 1, width: 300 }} className={styles.selector}>
        <InputLabel id={`${id}-operation-label`}>
          How to handle this relation...
        </InputLabel>
        <Select
          labelId={`${id}-operation-label`}
          id={`${id}-operation`}
          label="How to handle this relation..."
          value={operationInput}
          onChange={(e) => setOperationInput(e.target.value)}
        >
          {operationOptions.map((option) => (
            <MenuItem key={`${id}-${option.value}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
