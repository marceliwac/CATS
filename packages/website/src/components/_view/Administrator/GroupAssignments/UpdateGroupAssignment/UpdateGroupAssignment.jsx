import React from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdateGroupAssignment.module.scss';
import Form from '../../../Common/Form/Form';
import UpdateGroupAssignmentForm from './UpdateGroupAssignmentForm/UpdateGroupAssignmentForm';
import APIClient from '../../../../../util/APIClient';
import useApiData from '../../../../../hooks/useApiData';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function UpdateGroupAssignment() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [formAlert, setFormAlert] = React.useState(null);

  const { data, isLoading, error, reload } = useApiData({
    path: `/administrator/groups/${groupId}`,
  });

  if (isLoading) {
    return <Loading message="Fetching group assignment..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  async function onSubmit(d) {
    const group = {
      cognitoIds: d.cognitoIds,
      stayIds: d.stayIds,
    };

    try {
      const response = await APIClient.patch(
        `/administrator/groups/${groupId}`,
        group
      );
      setFormAlert({
        severity: 'success',
        title: 'Group updated successfully!',
        message:
          'Your group assignment has been updated successfully. You will be redirected shortly.',
      });
      reload();
      setTimeout(() => {
        setFormAlert(null);
      }, 3000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not update group!',
        message:
          'Something went wrong during group assignment update. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.completeSignUp}>
      <p className={styles.description}>
        Create a new group assignment using the form below.
      </p>
      <Form onSubmit={(d) => onSubmit(d)}>
        <UpdateGroupAssignmentForm
          name={data.name}
          cognitoIds={data.cognitoIds}
          stayIds={data.stayIds}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Update
          </Button>
        </div>
        {formAlert && (
          <div className={styles.alert}>
            <Alert severity={formAlert.severity}>
              {formAlert.title && <AlertTitle>{formAlert.title}</AlertTitle>}
              {formAlert.message}
            </Alert>
          </div>
        )}
      </Form>
    </div>
  );
}
