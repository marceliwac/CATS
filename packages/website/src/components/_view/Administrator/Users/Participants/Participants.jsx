import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import Table, {
  USER_STATUS_COLUMN_ENUM,
} from '../../../Common/Table/Table/Table';
import useApiData from '../../../../../hooks/useApiData';
import Loading from '../../../Common/Loading/Loading';
import APIClient from '../../../../../util/APIClient';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function Participants() {
  const navigate = useNavigate();
  const { data, error, isLoading, reload } = useApiData({
    path: '/administrator/users/groups/participants',
    params: {
      includeStayAssignmentCount: true,
    },
  });

  function inviteParticipant() {
    navigate('invite');
  }

  async function disableUsers(userIds) {
    await APIClient.patch('/administrator/users', {
      userIds,
      operation: 'disable',
    });
    reload();
  }

  async function enableUsers(userIds) {
    await APIClient.patch('/administrator/users', {
      userIds,
      operation: 'enable',
    });
    reload();
  }

  if (isLoading) {
    return <Loading message="Fetching participants..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const mappedData = data.map((row) => {
    const percentageComplete =
      row.stayAssignmentCount === 0
        ? 0
        : ((100 * row.labelledStayCount) / row.stayAssignmentCount).toFixed(0);
    return {
      ...row,
      percentageComplete: `${percentageComplete} %`,
    };
  });

  return (
    <Table
      rows={mappedData}
      title="Participants"
      topButtons={[
        {
          label: 'Invite participant',
          handler: () => {
            inviteParticipant();
          },
        },
      ]}
      linkFunction={(id) => `/administrator/stayAssignments/${id}`}
      allowSelect
      selectedActions={[
        {
          handler: (userIds) => enableUsers(userIds),
          label: 'Enable users',
          icon: <LockOpenIcon />,
        },
        {
          handler: (userIds) => disableUsers(userIds),
          label: 'Disable users',
          icon: <LockIcon />,
        },
      ]}
      columns={[
        {
          id: 'givenName',
          label: 'First name',
          numeric: false,
        },
        {
          id: 'familyName',
          label: 'Last name',
          numeric: false,
        },
        {
          id: 'email',
          label: 'Email address',
          numeric: false,
        },
        {
          id: 'percentageComplete',
          label: 'Completed',
          numeric: false,
        },
        {
          id: 'stayAssignmentCount',
          label: 'Stay assignment count',
          numeric: true,
        },
        {
          id: 'labelledStayCount',
          label: 'Labelled stays',
          numeric: true,
        },
        {
          id: 'status',
          label: 'Account status',
          numeric: false,
          enum: USER_STATUS_COLUMN_ENUM,
        },
        {
          id: 'isEnabled',
          label: 'Enabled',
          boolean: true,
        },
      ]}
    />
  );
}
