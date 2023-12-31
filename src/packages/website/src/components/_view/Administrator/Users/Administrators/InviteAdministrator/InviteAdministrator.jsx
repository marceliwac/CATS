import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Form from '../../../../Common/Form/Form';
import APIClient from '../../../../../../util/APIClient';
import styles from './InviteAdministrator.module.scss';
import FormTextField from '../../../../Common/FormTextField/FormTextField';
import FormAlert from '../../../../Common/FormAlert/FormAlert';

export default function InviteAdministrator() {
  const [formAlert, setFormAlert] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  async function onSubmit(data) {
    setIsSubmitting(true);
    const userData = {
      userEmail: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      group: 'administrators',
    };
    try {
      await APIClient.post('/administrator/users', userData);
      setHasSubmitted(true);
      setFormAlert({
        severity: 'success',
        title: 'Administrator invited successfully!',
        message:
          'Administrator account has been successfully created. An e-mail will be sent to the new administrator asking them to complete registration.',
      });
    } catch (e) {
      setFormAlert({
        severity: 'error',
        title: 'Could not invite an administrator!',
        message:
          'Something went wrong during the administrator account creation. Please contact the administrator for further support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.inviteAdministrator}>
      <p className={styles.description}>
        Use this form to invite a new administrator to the platform. Doing so
        will create an account and send an invitational e-mail that will require
        the user to complete their registration.
      </p>
      <Form onSubmit={(data) => onSubmit(data)}>
        <div className={styles.horizontalInputs}>
          <FormTextField
            name="firstName"
            label="First name"
            autocomplete="given-name"
            rules={{
              required: { value: true, message: 'First name is required.' },
            }}
          />
          <FormTextField
            name="lastName"
            label="Last name"
            autocomplete="family-name"
            rules={{
              required: { value: true, message: 'Last name is required.' },
            }}
          />
        </div>
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
        <div className={styles.formControls}>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
            disabled={hasSubmitted}
            fullWidth
          >
            <span>Send invitation</span>
          </LoadingButton>
        </div>
        {formAlert && <FormAlert alert={formAlert} />}
      </Form>
    </div>
  );
}
