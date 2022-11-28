import React from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Table, {
  USER_STATUS_COLUMN_ENUM,
} from '../../../Common/Table/Table/Table';
import useApiData from '../../../../../hooks/useApiData';
import Loading from '../../../Common/Loading/Loading';
import APIClient from '../../../../../util/APIClient';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function Administrators() {
  const navigate = useNavigate();
  const { data, error, isLoading, reload } = useApiData({
    path: '/administrator/users/groups/administrators',
  });

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

  function inviteAdministrator() {
    navigate('invite');
  }

  if (isLoading) {
    return <Loading message="Fetching administrators..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <Table
      rows={data}
      topButtons={[
        {
          label: 'Invite administrator',
          handler: () => {
            inviteAdministrator();
          },
        },
      ]}
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
      title="Administrators"
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
          label: 'E-mail address',
          numeric: false,
        },
        {
          id: 'isEmailVerified',
          label: 'Email verified',
          boolean: true,
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
