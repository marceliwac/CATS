import React from 'react';
import styles from './CreateRuleset.module.scss';
import TreeEditor from './TreeEditor/TreeEditor';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import tempData from './tempData';

export default function CreateRuleset() {
  return (
    <TreeEditorProvider initialData={tempData}>
      <div className={styles.treeEditorWrapper}>
        <TreeEditor />
      </div>
    </TreeEditorProvider>
  );
}
