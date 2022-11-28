import React from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Form from '../../Common/Form/Form';
import styles from './CompleteManualSignUp.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';

export default function CompleteManualSignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    try {
      await Auth.confirmSignUp(data.email, data.verificationCode);
      navigate('/');
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
    <div className={styles.completeManualSignUp}>
      <p className={styles.description}>
        Complete your registration and account using the form below.
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
        <FormTextField
          name="verificationCode"
          label="Verification code"
          autocomplete="off"
          defaultValue={searchParams.get('code')}
          rules={{
            required: {
              value: true,
              message: 'Verification code is required.',
            },
          }}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Complete Sign Up
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
