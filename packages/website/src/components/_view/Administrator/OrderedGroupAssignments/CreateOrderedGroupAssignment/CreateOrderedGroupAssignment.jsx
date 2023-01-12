import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import styles from './CreateOrderedGroupAssignment.module.scss';
import Form from '../../../Common/Form/Form';
import CreateOrderedGroupAssignmentForm from './CreateOrderedGroupAssignmentForm/CreateOrderedGroupAssignmentForm';
import APIClient from '../../../../../util/APIClient';
import FormAlert from '../../../Common/FormAlert/FormAlert';

export default function CreateOrderedGroupAssignment() {
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    const orderedGroupAssignment = {
      name: data.name,
      addUsersByDefault: data.addUsersByDefault,
      individualStayCount: data.individualStayCount,
      sharedStayCount: data.sharedStayCount,
      cognitoIds: data.cognitoIds,
      stayIds: data.stayIds,
    };

    try {
      const response = await APIClient.post(
        '/administrator/orderedGroupAssignments',
        orderedGroupAssignment
      );
      setFormAlert({
        severity: 'success',
        title: 'Ordered group assignment created successfully!',
        message:
          'Your ordered group assignment has been created successfully. You will be redirected shortly.',
      });
      setTimeout(() => {
        navigate(`/administrator/orderedGroupAssignments/${response.data.id}`);
      }, 2000);
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not create ordered group assignment!',
        message:
          'Something went wrong during ordered group assignment creation. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.completeSignUp}>
      <p className={styles.description}>
        Create a new group assignment using the form below.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <CreateOrderedGroupAssignmentForm />
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
