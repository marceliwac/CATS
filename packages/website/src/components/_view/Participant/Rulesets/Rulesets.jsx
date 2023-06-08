import React from 'react';
import Button from '@mui/material/Button';
import styles from './Rulesets.module.scss';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import RulesetEntry from './RulesetEntry/RulesetEntry';

export default function Rulesets() {
  const { data, error, isLoading } = useApiData({
    path: `/participant/rulesets`,
    params: {
      includeRuleRelationCount: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching rulesets..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const sharedEntries = data.filter((ruleset) => ruleset.isShared);
  const privateEntries = data.filter((ruleset) => !ruleset.isShared);

  return (
    <div className={styles.rulesets}>
      <div className={styles.topRow}>
        <h1>Rulesets</h1>
        <Button variant="contained">Create ruleset</Button>
      </div>
      <div className={styles.description}>
        <p>
          The list below displays
          {sharedEntries.length > 0 ? ' the example rulesets and ' : ' '}the
          rulesets you have created. Each ruleset is composed of rules and
          relations defining the conditions under which the weaning label should
          be applied. You can create a new ruleset from scratch, or use an
          existing ruleset as a starting point. Once created, the ruleset will
          be processed and applied to the entire dataset; when the processing
          completes, you will be able to view the statistic of the annotations
          applied.
        </p>
      </div>
      {sharedEntries.length > 0 && (
        <div className={styles.subgroup}>
          <h2>Examples</h2>
          <div className={styles.rulesetEntries}>
            {sharedEntries.map((entry) => (
              <RulesetEntry
                key={entry.id}
                id={entry.id}
                name={entry.name}
                ruleCount={entry.ruleCount}
                relationCount={entry.relationCount}
                status={entry.status}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.subgroup}>
        <h2>My rulesets</h2>
        <div className={styles.rulesetEntries}>
          {privateEntries.map((entry) => (
            <RulesetEntry
              key={entry.id}
              id={entry.id}
              name={entry.name}
              ruleCount={entry.ruleCount}
              relationCount={entry.relationCount}
              status={entry.status}
            />
          ))}
          {privateEntries.length === 0 && (
            <div className={styles.noData}>
              <p>You did not create any rulesets yet.</p>
              <p>
                <a href="create">Create one now</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
