import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Form from '../../Common/Form/Form';
import styles from './VerifyContactDetails.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';
import FormAlert from '../../Common/FormAlert/FormAlert';

export default function VerifyContactDetails() {
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await Auth.confirmSignUp(data.email, data.verificationCode);
      setHasSubmitted(true);
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.verifyContactDetails}>
      <h1>Verify contact details</h1>
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
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
            disabled={hasSubmitted}
            fullWidth
          >
            <span>Verify new details</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}
