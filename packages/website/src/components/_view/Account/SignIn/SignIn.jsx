import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Auth } from 'aws-amplify';
import Form from '../../Common/Form/Form';
import styles from './SignIn.module.scss';
import FormTextField from '../../Common/FormTextField/FormTextField';
import UnauthenticatedRoute from '../../../_functional/UnauthenticatedRoute';
import FormAlert from '../../Common/FormAlert/FormAlert';

function SignIn() {
  const navigate = useNavigate();
  const [formAlert, setFormAlert] = React.useState(null);

  async function onSubmit(data) {
    try {
      const user = await Auth.signIn({
        username: data.email,
        password: data.password,
      });
      if (
        user &&
        user.signInUserSession &&
        user.signInUserSession.idToken &&
        user.signInUserSession.idToken.payload &&
        user.signInUserSession.idToken.payload['cognito:groups']
      ) {
        const groups = user.signInUserSession.idToken.payload['cognito:groups'];
        if (groups.includes('administrators')) {
          navigate('/administrator');
        } else if (groups.includes('participant')) {
          navigate('/participant');
        }
        navigate('/');
      }
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        let userAttributesFragment = `&message=You need to change your password before signing in.&messageTitle=Password change required.`;
        if (user.challengeParam && user.challengeParam.userAttributes) {
          const userAttributes = user.challengeParam.userAttributes;
          if (userAttributes.given_name) {
            userAttributesFragment += `&firstName=${userAttributes.given_name}`;
          }
          if (userAttributes.family_name) {
            userAttributesFragment += `&lastName=${userAttributes.family_name}`;
          }
        }

        navigate(
          `/account/completeSignup?email=${data.email}&code=${data.password}${userAttributesFragment}`
        );
      }
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not sign in!',
        message:
          'Something went wrong during sign-in. Please make sure that your username and password are correct, and that you have confirmed your e-mail address.',
      });
    }
  }

  return (
    <div className={styles.signIn}>
      <h1>Sign In</h1>
      <p className={styles.description}>
        Use the form below to sign-in to your account. If you need an account,
        you can <Link to="/account/enroll">enroll here</Link>.
      </p>
      <p className={styles.description} />
      <Form onSubmit={(data) => onSubmit(data)}>
        <FormTextField
          name="email"
          label="E-mail address"
          autocomplete="email"
          rules={{
            required: { value: true, message: 'E-mail address is required.' },
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'E-mail address must be a valid e-mail.',
            },
          }}
        />
        <FormTextField
          name="password"
          label="Password"
          type="password"
          autocomplete="current-password"
          rules={{
            required: { value: true, message: 'Password is required.' },
          }}
        />
        <div className={styles.formControls}>
          <Button variant="contained" type="submit" fullWidth>
            Sign In
          </Button>
        </div>
        <p className={styles.description}>
          <Link to="/account/requestPasswordReset">Forgot password?</Link>
        </p>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}

export default UnauthenticatedRoute(SignIn);
