import React from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Form from '../../Common/Form/Form';
import styles from './SignUp.module.scss';
import SignUpForm from './SignUpForm/SignUpForm';

export default function SignUp() {
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
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
      setFormAlert({
        severity: 'success',
        title: 'Signup complete!',
        message:
          'You have been signed up, please verify your email address before signing in.',
      });
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not sign up!',
        message:
          'Something went wrong during sign-up. Please contact the administrator for further support.',
      });
    }
  }

  return (
    <div className={styles.signUp}>
      <p className={styles.description}>
        Sign up as a researcher using the form below. Before you will be able to
        use your account, your administrator will have to activate your account.
      </p>
      <p className={styles.description}>
        Already have an account? <Link to="/account/signIn">Sign in</Link>{' '}
        instead.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <SignUpForm />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Sign Up
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
