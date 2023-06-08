import React from 'react';
import uuid from 'react-uuid';
import layoutStyles from '../../../_layouts/Layout/Layout.module.scss';
import styles from './CreateRuleset.module.scss';
import TreeEditor from '../../Common/TreeEditor/TreeEditor';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import RulesetForm from './RulesetForm/RulesetForm';

const startingRuleset = {
  attributes: {
    id: uuid(),
    nodeType: 'RELATION',
    operation: 'OR',
  },
};

export default function CreateRuleset() {
  return (
    <div className={layoutStyles.forceFullWidth}>
      <TreeEditorProvider initialData={startingRuleset}>
        <div className={styles.form}>
          <RulesetForm />
        </div>
        <div className={styles.treeEditorWrapper}>
          <TreeEditor isEditable />
        </div>
      </TreeEditorProvider>
    </div>
  );
}
