import React from 'react';
import { useNavigate } from 'react-router-dom';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function GroupAssignments() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useApiData({
    path: `/administrator/groupAssignments`,
    params: {
      includeParticipantCount: true,
      includeStayCount: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching group assignments..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  function createGroupAssignment() {
    navigate('create');
  }

  const formattedData = data.map((row) => ({
    ...row,
    cognitoIdCount: row.cognitoIds.length,
    stayIdCount: row.stayIds.length,
  }));

  return (
    <Table
      rows={formattedData}
      allowSort
      title="Group assignments"
      linkFunction={(id) => id}
      topButtons={[
        {
          label: 'Create group assignment',
          handler: () => {
            createGroupAssignment();
          },
        },
      ]}
      columns={[
        {
          id: 'name',
          label: 'Name',
          numeric: false,
        },
        {
          id: 'cognitoIdCount',
          label: 'Participant count',
          numeric: true,
        },
        {
          id: 'stayIdCount',
          label: 'Stay count',
          numeric: true,
        },
        {
          id: 'addUsersByDefault',
          label: 'Add by default',
          boolean: true,
        },
      ]}
    />
  );
}
