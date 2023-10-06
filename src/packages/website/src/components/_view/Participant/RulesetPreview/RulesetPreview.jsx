import React from 'react';
import { useParams } from 'react-router-dom';
import layoutStyles from '../../../_layouts/Layout/Layout.module.scss';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import styles from './RulesetPreview.module.scss';
import TreeEditor from '../../Common/TreeEditor/TreeEditor';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';

export default function RulesetPreview() {
  const { rulesetId } = useParams();
  const { data, error, isLoading } = useApiData({
    path: `/participant/rulesets/${rulesetId}`,
  });

  if (isLoading) {
    return <Loading message="Fetching ruleset..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <div className={layoutStyles.forceFullWidth}>
      <TreeEditorProvider initialData={data.ruleset}>
        <div className={styles.treeEditorWrapper}>
          <TreeEditor isEditable />
        </div>
      </TreeEditorProvider>
    </div>
  );
}
