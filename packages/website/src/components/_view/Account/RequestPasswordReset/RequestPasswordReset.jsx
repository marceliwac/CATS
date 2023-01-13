import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './RequestPasswordReset.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';
import Form from '../../Common/Form/Form';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function RequestPasswordReset() {
  const [searchParams] = useSearchParams();
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await Auth.forgotPassword(data.email);
      setHasSubmitted(true);
      setFormAlert({
        severity: 'success',
        title: 'Password reset initiated!',
        message:
          'If an account with this e-mail exists, you should receive an e-mail with a verification code shortly. Please check your inbox.',
      });
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
    <div className={styles.requestPasswordReset}>
      <h1>Reset Password</h1>
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
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
            disabled={hasSubmitted}
            fullWidth
          >
            <span>Reset Password</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

export default UnauthenticatedRoute(RequestPasswordReset);
