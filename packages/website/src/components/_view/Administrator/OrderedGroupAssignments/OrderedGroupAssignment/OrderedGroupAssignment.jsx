import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './OrderedGroupAssignment.module.scss';
import useApiData from '../../../../../hooks/useApiData';
import Table from '../../../Common/Table/Table/Table';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function OrderedGroupAssignment() {
  const { orderedGroupAssignmentId } = useParams();
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);
  const { data, isLoading, error } = useApiData({
    path: `/administrator/orderedGroupAssignments/${orderedGroupAssignmentId}`,
    params: {
      includeStayAssignments: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching ordered group assignment..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const participantData = data.cognitoIds.map((cognitoId) => ({
    id: cognitoId,
    cognitoId,
  }));

  const sharedStayData = data.sharedStayIds.map((stayId) => ({
    id: stayId,
    stayId,
  }));

  const stayAssignmentData = data.stayAssignments;

  async function editOrderedGroupAssignment() {
    navigate(`edit`);
  }
  async function deleteOrderedGroupAssignment() {
    try {
      await APIClient.delete(
        `/administrator/orderedGroupAssignments/${orderedGroupAssignmentId}`
      );
      setFormAlert({
        severity: 'success',
        title: 'Ordered group assignment deleted successfully!',
        message:
          'Your ordered group assignment has been deleted successfully. You will be redirected shortly.',
      });
      setTimeout(() => {
        navigate(`/administrator/orderedGroupAssignments`);
      }, 2000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not delete ordered group assignment!',
        message:
          'Something went wrong during deletion of your ordered group assignment. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <>
      <div className={styles.topRow}>
        <h1>
          Ordered Group Assignment {orderedGroupAssignmentId.substring(0, 8)}
        </h1>
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => editOrderedGroupAssignment()}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => deleteOrderedGroupAssignment()}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={styles.table}>
        <Table
          rows={sharedStayData}
          allowSort
          title="Shared Stays"
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
            {
              id: 'order',
              label: 'Order #',
              numeric: true,
            },
          ]}
        />
      </div>
      {formAlert && <FormAlert alert={formAlert} />}
    </>
  );
}
