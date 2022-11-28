import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Form from '../../Common/Form/Form';
import styles from './VerifyContactDetails.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';

export default function VerifyContactDetails() {
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    try {
      await Auth.confirmSignUp(data.email, data.verificationCode);
      setFormAlert({
        severity: 'success',
        title: 'New contact details verified successfully!',
        message:
          'Your new contact details have been verified! You can now use them to sign in.',
      });
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not verify new contact details!',
        message:
          'Something went wrong during the verification of your new contact details. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.verifyContactDetails}>
      <p className={styles.description}>
        Verify your new contact details using the form below.
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
            Verify new details
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
