import React from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './ResetPassword.module.scss';
import Form from '../../Common/Form/Form';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function ResetPassword() {
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    try {
      await Auth.forgotPasswordSubmit(
        data.email,
        data.verificationCode,
        data.newPassword
      );
      navigate('/account/signIn');
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not complete sign up!',
        message:
          'Something went wrong during sign-up. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.resetPassword}>
      <h1>Create new password</h1>
      <p className={styles.description}>
        Reset the password using the form below. The verification code should
        have been sent to you when you requested password reset.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <ResetPasswordForm />

        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Change Password
          </Button>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

export default UnauthenticatedRoute(ResetPassword);
