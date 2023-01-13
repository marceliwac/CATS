import React from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Form from '../../Common/Form/Form';
import styles from './SignUp.module.scss';
import SignUpForm from './SignUpForm/SignUpForm';
import FormAlert from '../../Common/FormAlert/FormAlert';

export default function SignUp() {
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    const userData = {
      username: data.email,
      password: data.password,
      attributes: {
        given_name: data.firstName,
        family_name: data.lastName,
      },
    };
    try {
      await Auth.signUp(userData);
      setHasSubmitted(true);
      setFormAlert({
        severity: 'info',
        title: 'Confirm your account!',
        message: (
          <p>
            Please confirm your account using the link in the email that has
            just been sent to you. The email might be in the spam folder! You
            will need to confirm your account before signing in.
          </p>
        ),
      });
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not sign up!',
        message:
          'Something went wrong during sign-up. Please contact the administrator for further support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.signUp}>
      <h1>Sign Up</h1>
      <p className={styles.description}>
        Sign up as a participant in the study using the form below. Please
        ensure that you have completed all the steps outlined in the{' '}
        <Link to="/account/signIn">enrollment process</Link>.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <SignUpForm />
        <div className={styles.formControls}>
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={hasSubmitted}
            loading={isSubmitting}
            fullWidth
          >
            <span>Sign Up</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}
