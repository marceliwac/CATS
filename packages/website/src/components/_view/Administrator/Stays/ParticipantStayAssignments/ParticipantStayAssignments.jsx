import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import APIClient from '../../../../../util/APIClient';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function ParticipantStayAssignments() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data, isLoading, error, reload } = useApiData({
    path: `/administrator/stayAssignments/participants/${userId}`,
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

  function assignStays() {
    navigate('assign');
  }

  if (isLoading) {
    return <Loading message="Fetching stay assignments for participant..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <Table
      rows={data}
      topButtons={[
        {
          label: 'Assign stays',
          handler: () => {
            assignStays();
          },
        },
      ]}
      allowSelect
      selectedActions={[
        {
          handler: (stayAssignmentIds) => unassignStays(stayAssignmentIds),
          label: 'Unassign stays',
          icon: <CancelIcon />,
        },
      ]}
      title={`Stay assignments for user: ${userId.substring(0, 8)}`}
      columns={[
        {
          id: 'stayId',
          label: 'Stay ID',
          numeric: false,
        },
        {
          id: 'order',
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
