import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RulesetStays.module.scss';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import Table from '../../Common/Table/Table/Table';

export default function RulesetStays() {
  const { data, error, isLoading } = useApiData({
    path: `/participant/pinnedStays`,
  });

  if (isLoading) {
    return <Loading message="Fetching pinned stays..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <div className={styles.rulesetStays}>
      <div className={styles.description}>
        <p>
          The list below displays the pinned stays. You can view the labels
          applied to each of these stays by the selected ruleset by clicking on
          the link icon. To pin a stay, use the button located at the top right
          side above the table when previewing labels applied to a given stay.
          You will be able to view that table after you create your first
          ruleset.
        </p>
      </div>
      <div>
        {data.length > 0 && (
          <Table
            title="Pinned stays"
            linkFunction={(id) => `${id}`}
            linkFunctionColumn="stayId"
            rows={data}
            keyColumn="stayId"
            columns={[
              {
                id: 'stayId',
                label: 'Stay ID',
                numeric: true,
              },
            ]}
          />
        )}
        {data.length === 0 && (
          <div className={styles.noData}>
            <p>You did not pin any stays yet.</p>
            <p>
              <a href="/participant/rulesets">View my rulesets</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
