import React from 'react';
import layoutStyles from '../../../_layouts/Layout/Layout.module.scss';
import styles from './CreateRuleset.module.scss';
import TreeEditor from './TreeEditor/TreeEditor';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import tempData from './tempData';
import RulesetForm from './RulesetForm/RulesetForm';

export default function CreateRuleset() {
  return (
    <div className={layoutStyles.forceFullWidth}>
      <TreeEditorProvider initialData={tempData}>
        <div className={styles.form}>
          <RulesetForm />
        </div>
        <div className={styles.treeEditorWrapper}>
          <TreeEditor />
        </div>
      </TreeEditorProvider>
    </div>
  );
}
