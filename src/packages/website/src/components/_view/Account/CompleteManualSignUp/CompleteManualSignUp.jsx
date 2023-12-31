import React from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Form from '../../Common/Form/Form';
import styles from './CompleteManualSignUp.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';
import FormAlert from '../../Common/FormAlert/FormAlert';

export default function CompleteManualSignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await Auth.confirmSignUp(data.email, data.verificationCode);
      navigate('/');
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
    <div className={styles.completeManualSignUp}>
      <h1>Complete Signup</h1>
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
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            <span>Complete Sign Up</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}
