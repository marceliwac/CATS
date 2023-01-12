import React from 'react';
import { useNavigate } from 'react-router-dom';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function OrderedGroupAssignments() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useApiData({
    path: `/administrator/orderedGroupAssignments`,
  });

  if (isLoading) {
    return <Loading message="Fetching ordered group assignments..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  function createOrderedGroupAssignment() {
    navigate('create');
  }

  const formattedData = data.map((row) => ({
    ...row,
    cognitoIdCount: row.cognitoIds.length,
    individualStayCount: row.individualStayCount,
    sharedStayCount: row.sharedStayCount,
  }));

  return (
    <Table
      rows={formattedData}
      allowSort
      title="Ordered group assignments"
      linkFunction={(id) => id}
      topButtons={[
        {
          label: 'Create ordered group assignment',
          handler: () => {
            createOrderedGroupAssignment();
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
          id: 'sharedStayCount',
          label: 'Shared stay count',
          numeric: true,
        },
        {
          id: 'individualStayCount',
          label: 'Individual stay count',
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
