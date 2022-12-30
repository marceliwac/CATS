import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './StayAssignments.module.scss';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import APIClient from '../../../../../util/APIClient';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function StayAssignments() {
  const { data, isLoading, error, reload } = useApiData({
    path: `/administrator/stayAssignments`,
    params: {
      includeLabelCount: true,
    },
  });

  async function unassignStays(stayAssignmentIds) {
    await APIClient.delete('/administrator/stayAssignments', {
      data: { stayAssignmentIds },
    });
    reload();
  }

  if (isLoading) {
    return <Loading message="Fetching stay assignments..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <Table
      rows={data}
      allowSort
      allowSelect
      selectedActions={[
        {
          handler: (stayAssignmentIds) => unassignStays(stayAssignmentIds),
          label: 'Unassign stays',
          icon: <CancelIcon />,
        },
      ]}
      title="Stay assignments"
      columns={[
        {
          id: 'stayId',
          label: 'Stay ID',
          numeric: false,
        },
        {
          id: 'cognitoId',
          label: 'User ID',
          numeric: false,
        },
        {
          id: 'orderNumber',
          label: 'Order #',
          numeric: true,
        },
        {
          id: 'isLabelled',
          label: 'Labelled',
          boolean: true,
        },
        {
          id: 'labelCount',
          label: 'Label Count',
          numeric: true,
        },
      ]}
    />
  );
}
