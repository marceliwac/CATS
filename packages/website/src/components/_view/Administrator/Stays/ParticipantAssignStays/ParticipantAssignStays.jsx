import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import Table from '../../../Common/Table/Table/Table';
import APIClient from '../../../../../util/APIClient';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';
import useApiData from '../../../../../hooks/useApiData';

export default function ParticipantAssignStays() {
  const { userId } = useParams();
  const {
    data: staysData,
    isLoading: staysIsLoading,
    error: staysError,
    reload: staysReload,
  } = useApiData({
    path: `/administrator/stays`,
    params: {
      includeAssignmentCount: true,
    },
  });
  const {
    data: stayAssignmentsData,
    isLoading: stayAssignmentsIsLoading,
    error: stayAssignmentsError,
    reload: stayAssignmentsReload,
  } = useApiData({
    path: `/administrator/stayAssignments/participants/${userId}`,
  });

  async function assignStays(stayIds) {
    await APIClient.post('/administrator/stayAssignments', {
      cognitoId: userId,
      stayIds,
    });
    staysReload();
    stayAssignmentsReload();
  }

  if (staysIsLoading || stayAssignmentsIsLoading) {
    return <Loading message="Fetching stays..." />;
  }

  if (
    staysError ||
    stayAssignmentsError ||
    staysData === null ||
    stayAssignmentsData === null
  ) {
    return getErrorComponentFromHttpError(staysError || stayAssignmentsError);
  }

  const existingStayAssignmentIds = stayAssignmentsData.map(
    (stayAssignment) => stayAssignment.stayId
  );
  const processedData = staysData.map((row) => ({
    ...row,
    id: row.stayId,
    isAlreadyAssigned: existingStayAssignmentIds.includes(row.stayId),
  }));

  return (
    <Table
      rows={processedData}
      allowSelect
      allowSort
      allowPagination
      selectedActions={[
        {
          handler: (stayIds) => {
            assignStays(stayIds);
          },
          label: 'Assign stays',
          icon: <AddIcon />,
        },
      ]}
      title="Stays"
      columns={[
        {
          id: 'stayId',
          label: 'Stay ID',
          numeric: false,
        },
        {
          id: 'assignmentCount',
          label: 'Assigned to participants ',
          numeric: true,
        },
        {
          id: 'isAlreadyAssigned',
          label: 'Assigned to this user',
          boolean: true,
        },
      ]}
    />
  );
}
