import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import styles from './RequestPasswordReset.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';
import Form from '../../Common/Form/Form';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';

function RequestPasswordReset() {
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    try {
      await Auth.forgotPassword(data.email);
      setFormAlert({
        severity: 'success',
        title: 'Password reset initiated!',
        message:
          'If an account with this e-mail exists, you should receive an e-mail with a verification code shortly. Please check your inbox.',
      });
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
    <div className={styles.requestPasswordReset}>
      <p className={styles.description}>
        Reset the password using the form below. The verification code should
        have been sent to you when you requested password reset.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <FormTextField
          name="email"
          label="E-mail address"
          autocomplete="email"
          defaultValue={searchParams.get('email')}
          rules={{
            required: { value: true, message: 'E-mail address is required.' },
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'E-mail address must be a valid e-mail.',
            },
          }}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Reset Password
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

export default UnauthenticatedRoute(RequestPasswordReset);
