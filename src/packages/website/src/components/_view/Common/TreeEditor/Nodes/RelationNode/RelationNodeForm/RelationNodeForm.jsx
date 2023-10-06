import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { ListItemIcon, ListItemText } from '@mui/material';
import styles from './RelationNodeForm.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import usePostInitDebouncing from '../../../../../../../hooks/usePostInitDebouncing';
import TreeEditorConfig from '../../../TreeEditorConfig';

const {
  relation: { operationOptions },
} = TreeEditorConfig;

function getOptionLabel(value) {
  const matchingParameterOptions = operationOptions.filter(
    (option) => option.value === value
  );
  return matchingParameterOptions.length > 0
    ? matchingParameterOptions[0].label
    : '';
}

export default function RelationNodeForm(props) {
  const { id, operation, isEditable } = props;
  const [operationInput, setOperationInput] = React.useState(operation);
  const { updateNode } = useTreeEditor();

  usePostInitDebouncing(() => {
    updateNode(id, {
      operation: operationInput,
    });
  }, [id, updateNode, operationInput]);

  return (
    <div className={styles.relationNodeForm}>
      <FormControl className={styles.operationDropdown} disabled={!isEditable}>
        <InputLabel id={`${id}-operation-label`}>
          How to handle this relation
        </InputLabel>
        <Select
          className={styles.select}
          labelId={`${id}-operation-label`}
          id={`${id}-operation`}
          label="How to handle this relation"
          value={operationInput}
          onChange={(e) => setOperationInput(e.target.value)}
          renderValue={(value) => getOptionLabel(value)}
        >
          {operationOptions.map((option) => (
            <MenuItem key={`${id}-${option.value}`} value={option.value}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
