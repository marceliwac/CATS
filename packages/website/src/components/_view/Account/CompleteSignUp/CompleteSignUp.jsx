import React from 'react';
import { Auth } from 'aws-amplify';
import { useSearchParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Form from '../../Common/Form/Form';
import styles from './CompleteSignUp.module.scss';
import CompleteSignUpForm from './CompleteSignupForm/CompleteSignupForm';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function CompleteSignUp() {
  const [searchParams] = useSearchParams();
  let defaultFormAlert = null;
  if (searchParams.get('message') && searchParams.get('messageTitle')) {
    defaultFormAlert = {
      severity: 'info',
      title: searchParams.get('messageTitle'),
      message: searchParams.get('message'),
    };
  }
  const [formAlert, setFormAlert] = React.useState(defaultFormAlert);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    const userAttributes = {
      given_name: data.firstName,
      family_name: data.lastName,
    };
    try {
      const user = await Auth.signIn(data.email, data.currentPassword);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        await Auth.completeNewPassword(user, data.newPassword, userAttributes);
        // The Auth.Hub listener will handle the redirect automatically.
      }
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
    <div className={styles.completeSignUp}>
      <h1>Complete Signup</h1>
      <p className={styles.description}>
        Complete your registration and account using the form below.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <CompleteSignUpForm />
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

export default UnauthenticatedRoute(CompleteSignUp);
