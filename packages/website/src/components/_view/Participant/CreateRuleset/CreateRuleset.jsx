import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import { InputAdornment, OutlinedInput } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './CreateRuleset.module.scss';
import TreeEditor from './TreeEditor/TreeEditor';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import tempData from './tempData';
import RulesetForm from './RulesetForm/RulesetForm';

export default function CreateRuleset() {
  const [globalError, setGlobalError] = React.useState(false);

  return (
    <TreeEditorProvider initialData={tempData}>
      <div className={styles.topRow}>
        <RulesetForm error={globalError} />
      </div>
      <div className={styles.treeEditorWrapper}>
        <TreeEditor setGlobalError={setGlobalError} />
      </div>
    </TreeEditorProvider>
  );
}
