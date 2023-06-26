import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import Button from '@mui/material/Button';
import styles from './Ruleset.module.scss';
import useApiData from '../../../../hooks/useApiData';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import LabelStatistics from './LabelStatistics/LabelStatistics';
import AggregateMetric from './AggregateMetric/AggregateMetric';
import RulesetStatus from '../../Common/RulesetStatus/RulesetStatus';
import AggregateMetricSkeleton from './Skeletons/AggregateMetricSkeleton/AggregateMetricSkeleton';
import LabelStatisticsSkeleton from './Skeletons/LabelStatisticsSkeleton/LabelStatisticsSkeleton';

export default function Ruleset() {
  const navigate = useNavigate();
  const { rulesetId } = useParams();
  const { data, error, isLoading, reload } = useApiData({
    path: `/participant/rulesets/${rulesetId}`,
  });

  React.useEffect(() => {
    let timeout;
    if (!error && !isLoading && data && data.status === 'IN_PROGRESS') {
      timeout = setTimeout(() => {
        reload();
      }, 5000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [data, error, isLoading, reload]);

  if (error || (!isLoading && data === null)) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <div className={styles.ruleset}>
      <div className={styles.topRow}>
        <h1>{(data && data.name) || 'Ruleset'}</h1>
        <div className={styles.right}>
          <div className={styles.status}>
            <RulesetStatus status={(data && data.status) || null} bright />
          </div>
          <Button
            variant="outlined"
            startIcon={<AccountTreeOutlinedIcon />}
            onClick={
              data && data.id
                ? () => navigate(`/participant/rulesets/${data.id}/preview`)
                : () => {}
            }
          >
            Preview
          </Button>
        </div>
      </div>
      {(data && data.statistics && (
        <>
          <div className={styles.topStatistics}>
            <LabelStatistics statistics={data.statistics} />
          </div>
          <AggregateMetric
            label="Average label duration"
            dataKey="avgLabelDuration"
            data={data.statistics.avgLabelDuration}
          />
          <AggregateMetric
            label="Minimum label duration"
            dataKey="minLabelDuration"
            data={data.statistics.minLabelDuration}
          />
          <AggregateMetric
            label="Maximum label duration"
            dataKey="maxLabelDuration"
            data={data.statistics.maxLabelDuration}
          />
          <AggregateMetric
            label="Number of labels"
            dataKey="labelCount"
            data={data.statistics.labelCount}
          />
          <AggregateMetric
            label="Percentage of stay labelled"
            dataKey="percentageRowsLabelled"
            data={data.statistics.percentageRowsLabelled}
          />
          <AggregateMetric
            label="Total label duration"
            dataKey="totalLabelDuration"
            data={data.statistics.totalLabelDuration}
          />
        </>
      )) ||
        (data && data.status === 'FAILED' && (
          <div className={styles.failedRuleset}>
            <h3>Could not process ruleset!</h3>
            <p>
              It looks like something went wrong when trying to process this
              ruleset. If this problem persists, please contact support.
            </p>
          </div>
        )) || (
          <>
            <div className={styles.topStatistics}>
              <LabelStatisticsSkeleton />
            </div>
            <AggregateMetricSkeleton />
          </>
        )}
    </div>
  );
}
