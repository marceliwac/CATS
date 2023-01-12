import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './GroupAssignment.module.scss';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function GroupAssignments() {
  const { groupAssignmentId } = useParams();
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);
  const { data, isLoading, error } = useApiData({
    path: `/administrator/groupAssignments/${groupAssignmentId}`,
    params: {
      includeStayAssignments: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching group assignment..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const participantData = data.cognitoIds.map((cognitoId) => ({
    id: cognitoId,
    cognitoId,
  }));

  const stayData = data.stayIds.map((stayId) => ({
    id: stayId,
    stayId,
  }));

  const stayAssignmentData = data.stayAssignments;

  async function editGroupAssignment() {
    navigate(`edit`);
  }

  async function deleteGroupAssignment() {
    try {
      await APIClient.delete(
        `/administrator/groupAssignments/${groupAssignmentId}`
      );
      setFormAlert({
        severity: 'success',
        title: 'Group deleted successfully!',
        message:
          'Your group assignment has been deleted successfully. You will be redirected shortly.',
      });
      setTimeout(() => {
        navigate(`/administrator/groupAssignments`);
      }, 2000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not delete group!',
        message:
          'Something went wrong during deletion of your group assignment. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <>
      <div className={styles.topRow}>
        <h1>Group Assignment {groupAssignmentId.substring(0, 8)}</h1>
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => editGroupAssignment()}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteGroupAssignment()}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={styles.table}>
        <Table
          rows={stayData}
          allowSort
          title="Stays"
          columns={[
            {
              id: 'stayId',
              label: 'Stay ID',
              numeric: false,
            },
          ]}
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={participantData}
          allowSort
          title="Participants"
          columns={[
            {
              id: 'cognitoId',
              label: 'Participant ID',
              numeric: false,
            },
          ]}
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={stayAssignmentData}
          allowSort
          title="Stay Assignments"
          columns={[
            {
              id: 'stayId',
              label: 'Stay ID',
              numeric: false,
            },
            {
              id: 'cognitoId',
              label: 'Participant ID',
              numeric: false,
            },
          ]}
        />
      </div>
      {formAlert && <FormAlert alert={formAlert} />}
    </>
  );
}
