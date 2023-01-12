import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import styles from './CreateGroupAssignment.module.scss';
import Form from '../../../Common/Form/Form';
import CreateGroupAssignmentForm from './CreateGroupAssignmentForm/CreateGroupAssignmentForm';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function CreateGroupAssignment() {
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    const groupAssignment = {
      name: data.name,
      addUsersByDefault: data.addUsersByDefault,
      cognitoIds: data.cognitoIds,
      stayIds: data.stayIds,
    };

    try {
      const response = await APIClient.post(
        '/administrator/groupAssignments',
        groupAssignment
      );
      setFormAlert({
        severity: 'success',
        title: 'Group created successfully!',
        message:
          'Your group assignment has been created successfully. You will be redirected shortly.',
      });
      setTimeout(() => {
        navigate(`/administrator/groupAssignments/${response.data.id}`);
      }, 2000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not create group assignment!',
        message:
          'Something went wrong during group assignment creation. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.completeSignUp}>
      <p className={styles.description}>
        Create a new group assignment using the form below.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <CreateGroupAssignmentForm />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Create
          </Button>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}
