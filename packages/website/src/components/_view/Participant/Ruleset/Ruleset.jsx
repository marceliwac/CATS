import React from 'react';
import { useParams } from 'react-router-dom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import styles from './Ruleset.module.scss';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import LabelStatistics from './LabelStatistics/LabelStatistics';
import AggregateMetric from './AggregateMetric/AggregateMetric';

function getReadableStatus(status) {
  switch (status) {
    case 'PENDING':
      return (
        <div className={styles.pending}>
          <AccessTimeOutlinedIcon />
          <p>Awaiting processing</p>
        </div>
      );
    case 'IN_PROGRESS':
      return (
        <div className={styles.inProgress}>
          <ChangeCircleOutlinedIcon />
          <p>Processing in progress</p>
        </div>
      );
    case 'COMPLETED':
      return (
        <div className={styles.completed}>
          <TaskAltIcon />
          <p>Processing complete</p>
        </div>
      );
    case 'FAILED':
      return (
        <div className={styles.failed}>
          <CancelOutlinedIcon />
          <p>Processing failed</p>
        </div>
      );
    default:
      return 'Unknown';
  }
}

export default function Ruleset() {
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
    <div className={styles.ruleset}>
      <div className={styles.topRow}>
        <h1>{data.name}</h1>
        <div className={styles.status}>{getReadableStatus(data.status)}</div>
      </div>
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
    </div>
  );
}
