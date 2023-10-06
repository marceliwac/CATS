import React from 'react';
import uuid from 'react-uuid';
import { useSearchParams } from 'react-router-dom';
import layoutStyles from '../../../_layouts/Layout/Layout.module.scss';
import styles from './CreateRuleset.module.scss';
import TreeEditor from '../../Common/TreeEditor/TreeEditor';
import { TreeEditorProvider } from '../../../../hooks/useTreeEditor';
import RulesetForm from './RulesetForm/RulesetForm';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import APIClient from '../../../../util/APIClient';

const DEFAULT_RULESET = {
  attributes: {
    id: uuid(),
    nodeType: 'RELATION',
    operation: 'OR',
  },
};

export default function CreateRuleset() {
  const [searchParams] = useSearchParams();
  const entrypointRulesetId = searchParams.get('entrypointRulesetId');
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (entrypointRulesetId) {
      APIClient.get(`/participant/rulesets/${entrypointRulesetId}`)
        .then((result) => {
          setData(result.data);
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setData({ ruleset: DEFAULT_RULESET });
      setIsLoading(false);
    }
  }, [entrypointRulesetId]);

  if (isLoading) {
    return <Loading message="Fetching group assignment..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <div className={layoutStyles.forceFullWidth}>
      <TreeEditorProvider initialData={data.ruleset}>
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
