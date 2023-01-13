import React from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './ResetPassword.module.scss';
import Form from '../../Common/Form/Form';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function ResetPassword() {
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await Auth.forgotPasswordSubmit(
        data.email,
        data.verificationCode,
        data.newPassword
      );
      navigate('/account/signIn');
    } catch (e) {
      setIsSubmitting(false);
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
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            <span>Change Password</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

export default UnauthenticatedRoute(ResetPassword);
