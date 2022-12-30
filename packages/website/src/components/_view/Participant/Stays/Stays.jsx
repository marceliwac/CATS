import React from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Table from '../../Common/Table/Table/Table';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './Stays.module.scss';

export default function Stays() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useApiData({
    path: '/participant/stayAssignments',
  });

  if (isLoading) {
    return <Loading message="Fetching stays..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const unLabelledData = data.filter(
    (stayAssignment) => !stayAssignment.isLabelled
  );
  if (unLabelledData.length === 0) {
    // Display alert - everything is labelled!
  }

  if (searchParams.get('navigateToNext') && unLabelledData.length > 0) {
    return <Navigate to={unLabelledData[0].id} />;
  }

  return (
    <div className={styles.stays}>
      <Table
        rows={data}
        title="Stays assigned to me"
        linkFunction={(id) => id}
        columns={[
          {
            id: 'stayId',
            label: 'Stay ID',
            numeric: false,
          },
          {
            id: 'isLabelled',
            label: 'Labelled',
            boolean: true,
          },
        ]}
      />
    </div>
  );
}
