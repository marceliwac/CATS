import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import Table from '../../Common/Table/Table/Table';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './Stays.module.scss';
import FormAlert from '../../Common/FormAlert/FormAlert';

export default function Stays() {
  let formAlert = null;
  const [searchParams] = useSearchParams();

  const { data, error, isLoading } = useApiData({
    path: '/participant/stayAssignments',
  });

  if (isLoading) {
    return <Loading message="Fetching stays..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const unLabelledData = data
    .filter((stayAssignment) => !stayAssignment.isLabelled)
    .sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      return 0;
    });
  if (unLabelledData.length === 0) {
    formAlert = {
      title: 'All admissions labelled!',
      message:
        'All admissions assigned to you are labeled. You can still edit the labels you have created if you wish to do so!',
      severity: 'success',
    };
  }

  if (searchParams.get('navigateToNext') && unLabelledData.length > 0) {
    return <Navigate to={unLabelledData[0].id} />;
  }

  return (
    <div className={styles.stays}>
      {formAlert && <FormAlert alert={formAlert} />}

      <Table
        rows={data}
        title="Stays assigned to me"
        linkFunction={(id) => id}
        defaultSortKey="order"
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
